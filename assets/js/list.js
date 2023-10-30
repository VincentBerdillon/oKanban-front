import {
  utilsModule
} from "./utils.js";
import {
  cardModule
} from "./card.js";

export const listModule = {

  showAddListModal: function () {
    const modal = document.getElementById("addListModal");
    modal.classList.add("is-active");
  },

  handleAddListForm: async function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {

      const response = await fetch(`${utilsModule.base_url}/lists`, {
        method: "POST",
        body: formData,
      });
      const json = await response.json();

      if (!response.ok) throw json;

      listModule.makeListInDOM(json);

    } catch (error) {
      alert("Impossible de créer la liste");
      console.log(error);
    }

    utilsModule.hideModals();
  },

  makeListInDOM: function (list) {

    const template = document.getElementById("template-list");
    const newList = document.importNode(template.content, true);

    const h2 = newList.querySelector("h2");
    h2.textContent = list.name;

    newList.querySelector(".panel").dataset.listId = list.id;
    newList.querySelector("form input[name='list-id']").value = list.id;

    newList
      .querySelector(".button--add-card")
      .addEventListener("click", cardModule.showAddCardModal);

    h2.addEventListener("dblclick", listModule.showEditListForm);

    newList
      .querySelector(".edit-list-form")
      .addEventListener("submit", listModule.handleEditListForm);

    newList
      .querySelector(".button--delete-list")
      .addEventListener("click", listModule.handelDeleteList);


    const cardsContainer = newList.querySelector(".panel-block");

    Sortable.create(cardsContainer, {
      group: "list",
      draggable: ".box",
      onEnd: cardModule.handleDragCard,
    });

    const listContainer = document.querySelector("#lists-container");
    listContainer.appendChild(newList);
  },

  showEditListForm: function (event) {
    const form = event.target;
    form.classList.add("is-hidden");
    form.nextElementSibling.classList.remove("is-hidden");
  },

  handleEditListForm: async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const h2 = form.previousElementSibling;
    try {
      const response = await fetch(
        `${utilsModule.base_url}/lists/${formData.get("list-id")}`, {
          method: "PATCH",
          body: formData,
        }
      );
      const json = await response.json();

      if (!response.ok) throw json;

      h2.textContent = json.name;

    } catch (error) {
      alert("Impossible de modifier la liste !");
      console.log(error);

    }

    form.classList.add("is-hidden");
    h2.classList.remove("is-hidden");
  },

  handelDeleteList: async function (event) {

    if (!confirm("Voulez-vous supprimer cette liste ?")) return;

    const listDOM = event.target.closest(".panel");
    try {
      const response = await fetch(
        `${utilsModule.base_url}/lists/${listDOM.dataset.listId}`, {
          method: "DELETE",
        }
      );
      const json = await response.json();

      if (!response.ok) throw json;

      listDOM.remove();

    } catch (error) {
      alert("Impossible de supprimer la liste !");
      console.log(error);
    }
  },

  updateDragList: function (event) {

    const listsDOM = event.target.querySelectorAll(".panel");

    listsDOM.forEach(async (listDOM, index) => {

      const formData = new FormData();
      formData.set("position", index);

      try {
        const response = await fetch(
          `${utilsModule.base_url}/lists/${listDOM.dataset.listId}`, {
            method: "PATCH",
            body: formData,
          }
        );
        const json = await response.json();

        if (!response.ok) throw json;

      } catch (error) {
        alert("Impossible de déplacer la liste");
        console.log(error);
      }
    });
  },
};