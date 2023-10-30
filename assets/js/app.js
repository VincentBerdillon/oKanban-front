import {
  utilsModule
} from "./utils.js";
import {
  listModule
} from "./list.js";
import {
  cardModule
} from "./card.js";
import {
  tagModule
} from "./tag.js";

var app = {
  init: function () {
    console.log("app init!");
    app.addListenerToActions();
    app.getListsFromAPI();
  },

  addListenerToActions: function () {

    const addListButton = document.getElementById("addListButton");
    addListButton.addEventListener("click", listModule.showAddListModal);

    const closeModalButtons = document.querySelectorAll(".close");
    for (const button of closeModalButtons) {
      button.addEventListener("click", utilsModule.hideModals);
    }

    const addListForm = document.querySelector("#addListModal form");
    addListForm.addEventListener("submit", listModule.handleAddListForm);

    const addCardButtons = document.querySelectorAll(".button--add-card");
    for (const button of addCardButtons) {
      button.addEventListener("click", cardModule.showAddCardModal);
    }

    const addCardForm = document.querySelector("#addCardModal form");
    addCardForm.addEventListener("submit", cardModule.handleAddCardForm);

    const associateTagForm = document.querySelector("#addTagToCardModal form");
    associateTagForm.addEventListener("submit", tagModule.associateToCard);
  },

  getListsFromAPI: async function () {
    try {

      const response = await fetch(`${utilsModule.base_url}/lists`);

      const json = await response.json();

      if (!response.ok) throw json;

      for (const list of json) {
        listModule.makeListInDOM(list);
        for (const card of list.cards) {
          cardModule.makeCardInDOM(card);
          for (const tag of card.tags) {
            tagModule.makeTagInDOM(tag);
          }
        }
      }

      const listContainer = document.getElementById("lists-container");

      Sortable.create(listContainer, {
        draggable: ".panel",
        onEnd: listModule.updateDragList,
      });
    } catch (error) {
      alert("Impossible de récupérer les listes de l'API");
      console.log(error);
    }
  },
};

document.addEventListener("DOMContentLoaded", app.init);