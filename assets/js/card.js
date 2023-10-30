import {
  utilsModule
} from "./utils.js";
import {
  tagModule
} from "./tag.js";

export const cardModule = {

  showAddCardModal: function (event) {
    const modal = document.getElementById("addCardModal");

    const listElement = event.target.closest(".panel");
    const listId = listElement.dataset.listId;

    const modalInput = modal.querySelector('input[name="list_id"]');
    modalInput.value = listId;

    modal.classList.add("is-active");
  },

  handleAddCardForm: async function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
      const response = await fetch(`${utilsModule.base_url}/cards`, {
        method: "POST",
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) throw json;

      cardModule.makeCardInDOM(json);

    } catch (error) {
      alert("Impossible de créer la carte");
      console.log(error);
    }

    utilsModule.hideModals();
  },

  makeCardInDOM: function (card) {

    const template = document.getElementById("template-card");
    const newCard = document.importNode(template.content, true);

    newCard.querySelector(".card-name").textContent = card.title;

    const cardDOM = newCard.querySelector(".box");
    cardDOM.dataset.cardId = card.id;
    cardDOM.querySelector('input[name="card-id"]').value = card.id;
    cardDOM.style.backgroundColor = card.color;
    cardDOM.querySelector('input[name="color"]').value = card.color;

    cardDOM
      .querySelector(".edit-card-icon")
      .addEventListener("click", cardModule.showEditCardForm);

    cardDOM
      .querySelector(".edit-card-form")
      .addEventListener("submit", cardModule.handleEditCardForm);

    cardDOM
      .querySelector(".delete-card-icon")
      .addEventListener("click", cardModule.handleDeleteCard);

    cardDOM
      .querySelector(".associate-tag-icon")
      .addEventListener("click", tagModule.showAssociateTagModal);


    const currentList = document.querySelector(
      `[data-list-id="${card.list_id}"]`
    );
    currentList.querySelector(".panel-block").appendChild(newCard);
  },

  showEditCardForm: function (event) {
    const cardDOM = event.target.closest(".box");
    cardDOM.querySelector(".card-name").classList.add("is-hidden");
    cardDOM.querySelector(".edit-card-form").classList.remove("is-hidden");
  },

  handleEditCardForm: async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const titleCard = form.previousElementSibling;

    try {
      const response = await fetch(
        `${utilsModule.base_url}/cards/${formData.get("card-id")}`, {
          method: "PATCH",
          body: formData,
        }
      );

      const json = await response.json();

      if (!response.ok) throw json;

      titleCard.textContent = json.title;
      form.closest(".box").style.backgroundColor = json.color;

    } catch (error) {
      alert("Impossible de mogifier la carte !");
      console.log(error);
    }

    form.classList.add("is-hidden");
    titleCard.classList.remove("is-hidden");
  },


  handleDeleteCard: async function (event) {

    const cardDOM = event.target.closest(".box");

    try {

      const response = await fetch(
        `${utilsModule.base_url}/cards/${cardDOM.dataset.cardId}`, {
          method: "DELETE",
        }
      );
      const json = await response.json();

      if (!response.ok) throw json;

      cardDOM.remove();

    } catch (error) {
      alert("Impossible de supprimer la carte!");
      console.log(error);
    }
  },

  handleDragCard: function (event) {

    let cardsDOM = event.from.querySelectorAll(".box");
    cardModule.updateAllCards(cardsDOM);

    if (event.from === event.to) return;

    cardsDOM = event.to.querySelectorAll(".box");
    const listId = event.to.closest(".panel").dataset.listId;
    cardModule.updateAllCards(cardsDOM, listId);

  },

  updateAllCards: function (cardsDOM, listId = null) {

    cardsDOM.forEach(async (cardDOM, index) => {
      const formData = new FormData();

      formData.set("position", index);

      if (listId) {
        formData.set("list_id", listId);
      }

      try {
        const response = await fetch(
          `${utilsModule.base_url}/cards/${cardDOM.dataset.cardId}`, {
            method: "PATCH",
            body: formData,
          }
        );
        const json = await response.json();

        if (!response.ok) throw json;

      } catch (error) {
        alert("Imossible de déplacer les cartes");
        console.log(error);
      }
    });
  },
};