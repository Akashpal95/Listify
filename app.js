// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCDLv0qu9sSb_gTnv0Wt0K5o0xnIk3vW94",
  authDomain: "listify-akash95.firebaseapp.com",
  projectId: "listify-akash95",
  storageBucket: "listify-akash95.appspot.com",
  messagingSenderId: "844878237220",
  appId: "1:844878237220:web:5b0bf9985a6af8889092b1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

async function renderAllTasks() {
  alltaskSnapshot = await db.collection("tasks").get();
  alltaskSnapshot.forEach(doc => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    $(".tasks-container").append(newTaskCardDom(doc.id, doc.data()));
    task_count += 1;
  });
  updateTaskCount();
}

function setEventOnAllCards() {
  let cards = document.getElementsByClassName("task-card");
  cards = Array.from(cards);
  cards.forEach(setHoverEvent);

  let del_buttons = Array.from(document.getElementsByClassName("delete"));
  del_buttons.forEach(setDeleteButton);

  let progress_buttons = Array.from(
    document.getElementsByClassName("status-icon")
  );
  progress_buttons.forEach(setProgressEvent);
}

window.onload = async function() {
  setAddButtonListener();
  await renderAllTasks();
  setEventOnAllCards();
};

/*###################################################*/
var task_count = 0;
function updateTaskCount() {
  document.getElementById("task-left-count").innerHTML = task_count;
}
function setProgressEvent(progress) {
  progress.addEventListener("click", changeProgress);
}
function setDeleteButton(deleteButton) {
  deleteButton.addEventListener("click", removeCard);
}

function setHoverEvent(taskCard) {
  taskCard.addEventListener("mouseover", function() {
    taskCard.children[3].style.visibility = "initial";
  });
  taskCard.addEventListener("mouseleave", function() {
    taskCard.children[3].style.visibility = "hidden";
  });
}

function setAddButtonListener() {
  let add_button = document.getElementById("add-button");
  add_button.addEventListener("click", function() {
    var task_input = document.getElementById("new-task");
    if (task_input.value === "") return;

    //Adding data in firestore
    db.collection("tasks")
      .add({
        name: task_input.value,
        status: "Not-started",
        priority: "Low"
      })
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
        docRef
          .get()
          .then(doc => {
            if (doc.exists) {
              console.log("Document data:", doc.data());
              $(".tasks-container").append(newTaskCardDom(doc.id, doc.data()));
              task_count += 1;
              //Change Task Count
              updateTaskCount();
              setEventOnAllCards();
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch(error => {
            console.log("Error getting document:", error);
          });
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });

    // //Adding the new task in the task container
    // var task_card = document.createElement("div");
    // task_card.innerHTML = task_card_string;
    // task_card.setAttribute("class", "task-card Not-started");
    // task_card.setAttribute("id", "t" + ++task_count);
    // task_container.appendChild(task_card);
    // let card_text = document.querySelector("#t" + task_count + " p");
    // card_text.innerHTML = task_input.value;
    task_input.value = "";
  });
}

function removeCard() {
  var parent = this.parentElement;
  console.log(parent);

  //Removing data from firestore
  db.collection("tasks")
    .doc(parent.getAttribute("id"))
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
      parent.classList.add("delete-card");
      setTimeout(function() {
        // console.log(this);
        parent.parentNode.removeChild(parent);
        updateTaskCount();
      }, 500);
      task_count--;
    })
    .catch(error => {
      console.error("Error removing document: ", error);
    });

  // this.parentElement.parentNode.removeChild(this.parentElement);
}

function changeProgress() {
  // console.log("hello");
  var parentCard = this.parentElement;
  console.log("change progress", parentCard);
  var taskRef = db.collection("tasks").doc(parentCard.getAttribute("id"));
  var status = parentCard.classList[1];
  parentCard.classList.remove(status);
  var statusElem = parentCard.children[2];

  if (status == "Not-started") {
    parentCard.classList.add("In-progress");
    statusElem.innerHTML = "In-progress";
    taskRef
      .update({
        status: "In-progress"
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch(error => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  } else if (status == "Completed") {
    parentCard.classList.add("In-progress");
    statusElem.innerHTML = "In-progress";
    taskRef
      .update({
        status: "In-progress"
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch(error => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  } else {
    parentCard.classList.add("Completed");
    statusElem.innerHTML = "Completed";
    taskRef
      .update({
        status: "Completed"
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch(error => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  }
}
/*###################################################*/
var completeAll = document.getElementById("check-all-button");
var clearComplete = document.getElementById("clearComplete");
var showAll = document.getElementById("showAll");
var showComplete = document.getElementById("showComplete");
var showInprogress = document.getElementById("showInprogress");
var showNotStarted = document.getElementById("showNotStarted");
var showState = "showAll";
showAll.style.color = "Black";

completeAll.addEventListener("click", function() {
  var progress_buttons = document.getElementsByClassName("status-icon");
  for (p of progress_buttons) {
    var parentCard = p.parentElement;
    var status = parentCard.classList[1];
    if (status == "Completed") continue;
    // parentCard.classList.remove(status);
    // var statusElem = parentCard.children[2];
    // parentCard.classList.remove(status);
    // parentCard.classList.add("Completed");
    // statusElem.innerHTML = "Completed";
    changeProgress.call(p);
  }
});

clearComplete.addEventListener("click", function() {
  let cards = document.getElementsByClassName("task-card Completed");
  let length = cards.length;
  let count = length - 1;
  intervalID = setInterval(function() {
    cards[count].classList.add("delete-card");
    task_count--;
    console.log("Deleting card!");
    setTimeout(
      function() {
        this.parentNode.removeChild(this);
        updateTaskCount();
      }.bind(cards[count]),
      500
    );
    count--;
    if (count < 0) {
      clearInterval(intervalID);
    }
  }, 500);
  db.collection("tasks")
    .where("status", "==", "Completed")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        doc.ref.delete();
        console.log(doc.id, " => ", doc.data());
      });
    })
    .catch(error => {
      console.log("Error getting documents: ", error);
    });
});

function resetColor() {
  var allButtons = document.getElementsByClassName("filter-button");
  for (button of allButtons) button.style.color = "gray";
}

showAll.addEventListener("click", function() {
  if (showState != "showAll") {
    resetColor();
    this.style.color = "black";
    var allCards = document.getElementsByClassName("task-card");
    for (card of allCards) {
      card.style.display = "flex";
    }
    showState = "showAll";
  }
});

showComplete.addEventListener("click", function() {
  if (showState != "showComplete") {
    resetColor();
    this.style.color = "black";
    var allCards = document.getElementsByClassName("task-card");
    // allCards[0].style.display = "none";
    for (card of allCards) {
      if (card.classList[1] != "Completed") card.style.display = "none";
      else card.style.display = "flex";
    }
    showState = "showComplete";
  }
});

showInprogress.addEventListener("click", function() {
  if (showState != "showInprogress") {
    resetColor();
    this.style.color = "black";
    var allCards = document.getElementsByClassName("task-card");
    // allCards[0].style.display = "none";
    for (card of allCards) {
      if (card.classList[1] != "In-progress") card.style.display = "none";
      else card.style.display = "flex";
    }
    showState = "showInprogress";
  }
});
showNotStarted.addEventListener("click", function() {
  if (showState != "showNotStarted") {
    resetColor();
    this.style.color = "black";
    var allCards = document.getElementsByClassName("task-card");
    // allCards[0].style.display = "none";
    for (card of allCards) {
      if (card.classList[1] != "Not-started") card.style.display = "none";
      else card.style.display = "flex";
    }
    showState = "showNotStarted";
  }
});

/*###################################################*/

//Template for image card dom
let newTaskCardDom = function(task_id, task_data) {
  return $(`<div class="task-card ${task_data.status}" id="${task_id}">
      <div class="status-icon"></div>
      <p class="task-text">${task_data.name}</p>
      <p class="task-status ${task_data.status}">${task_data.status}</p>
      <ion-icon
        class="delete fs-large mg-10"
        name="close-circle-outline"
      ></ion-icon>
    </div>`);
};
