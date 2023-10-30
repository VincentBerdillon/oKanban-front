import {
  utilsModule
} from "./utils.js";

export const tagModule = {

  makeTagInDOM: function (tag) {

    const tagDOM = document.createElement("span");
    tagDOM.classList.add("tag");

    tagDOM.dataset.tagId = tag.id;
    tagDOM.textContent = tag.name;
    tagDOM.style.backgroundColor = tag.color;

    const cardDOM = document.querySelector(
      `.box[data-card-id="${tag.card_has_tag.card_id}"]`
    );

    tagDOM.addEventListener("dblclick", tagModule.handleDeleteTag);

    cardDOM.querySelector(".tags").appendChild(tagDOM);
  },

  showAssociateTagModal: async function (event) {

    const cardDOM = event.target.closest(".box");
    const cardId = cardDOM.dataset.cardId;

    const modal = document.getElementById("addTagToCardModal");
    modal.querySelector('input[name="card_id"]').value = cardId;

    const select = modal.querySelector('select[name="tag_id"]');
    select.textContent = "";

    try {
      const response = await fetch(`${utilsModule.base_url}/tags`);
      const json = await response.json();

      if (!response.ok) throw json;

      const tagsDOM = cardDOM.querySelectorAll(".tag");

      if (tagsDOM.length === json.length) return utilsModule.hideModals();

      for (const tag of json) {
        const option = document.createElement("option");
        option.textContent = tag.name;
        option.value = tag.id;
        select.appendChild(option);
      }

    } catch (error) {
      alert("Impossible de récupérer les tags");
      console.log(error);
    }

    modal.classList.add("is-active");
  },

  associateToCard: async function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
      const response = await fetch(
        `${utilsModule.base_url}/cards/${formData.get("card_id")}/tags`, {
          method: "POST",
          body: formData,
        }
      );
      const json = await response.json();

      if (!response.ok) throw json;

      const tag = json.tags.find(
        (tag) => tag.id === Number(formData.get("tag_id"))
      );

      tagModule.makeTagInDOM(tag);

    } catch (error) {
      alert("Impossible d'associer le tag");
      console.log(error);
    }

    utilsModule.hideModals();
  },

  handleDeleteTag: async function (event) {

    const spanTag = event.target;
    const cardId = spanTag.closest(".box").dataset.cardId;
    const tagId = spanTag.dataset.tagId;

    try {
      const response = await fetch(
        `${utilsModule.base_url}/cards/${cardId}/tags/${tagId}`, {
          method: "DELETE",
        }
      );
      const json = await response.json();

      if (!response.ok) throw json;

      spanTag.remove();

    } catch (error) {
      alert("Impossible de supprimer le tag");
      console.log(error);
    }
  },
};