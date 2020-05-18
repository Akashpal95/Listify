var add_button = document.getElementById('add-button');
var del_buttons = document.getElementsByClassName('delete'); 
var task_container = document.querySelector('.tasks-container');
var task_input = document.getElementById('new-task')
var completeAll = document.getElementById('check-all-button');
var clearComplete = document.getElementById('clearComplete');
var showAll = document.getElementById('showAll');
var showComplete = document.getElementById('showComplete');
var showInprogress = document.getElementById('showInprogress');
var showNotStarted = document.getElementById('showNotStarted');
var showState = 'showAll';
showAll.style.color="Black";

//var task_card_string = "<div class=\"task-card not-started\"><div class=\"status-icon\"></div><p class=\"task-text\"></p><p class=\"task-status\">Not-Started</p><ion-icon class=\"delete fs-large mg-10\" name=\"close-circle-outline\"></ion-icon></div>"
var task_card_string = "<div class=\"status-icon\"></div><p class=\"task-text\"><p class=\"task-status color-red\">Not-Started</p><ion-icon class=\"delete fs-large mg-10\" name=\"close-circle-outline\"></ion-icon>"
var task_count = 5;
updateTaskCount();
eventSetter();

function updateTaskCount(){
    document.getElementById('task-left-count').innerHTML = task_count;
}

function eventSetter(){
    var del_buttons = document.getElementsByClassName('delete'); 
    for(del of del_buttons){
        del.addEventListener('click',removeCard);
    }
    var progress_buttons = document.getElementsByClassName('status-icon');
    for(p of progress_buttons){
        p.addEventListener('click', changeProgress);
    }
    var cards = document.getElementsByClassName('task-card');
    console.log(cards);
    for(let i=0;i<cards.length;i++){
        console.log(cards[i]);
        cards[i].addEventListener('mouseover', function(){
            console.log(cards[i]);
            cards[i].children[3].style.visibility="initial";
        })
        cards[i].addEventListener('mouseout', function(){
            console.log(cards[i].children[3].style.visibility);
            cards[i].children[3].style.visibility="hidden";
        })
    }
    
}

function reassignIDs(){
    var cards = document.getElementsByClassName('task-card');
    var count=1;
    for(card of cards){
        card.setAttribute("id", "t"+(count++));
        card.eve
    }
}

function resetColor(){
    var allButtons = document.getElementsByClassName('filter-button');
    for(button of allButtons)
        button.style.color = "gray";
}


add_button.addEventListener('click', function(){


    //Adding the new task in the task container
    var task_card = document.createElement('div');
    task_card.innerHTML= task_card_string
    task_card.setAttribute("class", "task-card not-started");
    task_card.setAttribute("id", "t"+(++task_count));
    task_container.appendChild(task_card);
    let card_text = document.querySelector('#t' + task_count + " p");
    card_text.innerHTML = task_input.value;
    task_input.value = "";
    
    //Change Task Count
   updateTaskCount();
   eventSetter();

})

document.addEventListener("keydown", function (event){
    var keyValue = event.key;
    if(keyValue=="Enter"){
         //Adding the new task in the task container
    var task_card = document.createElement('div');
    task_card.innerHTML= task_card_string
    task_card.setAttribute("class", "task-card not-started");
    task_card.setAttribute("id", "t"+(++task_count));
    task_container.appendChild(task_card);
    let card_text = document.querySelector('#t' + task_count + " p");
    card_text.innerHTML = task_input.value;
    task_input.value = "";
    
    //Change Task Count
   updateTaskCount();
   eventSetter();
    }
      
  });

function removeCard(){
    var parent = this.parentElement;
    parent.classList.add('delete-card');
    setTimeout(function(){
        // console.log(this);
        parent.parentNode.removeChild(parent);
        updateTaskCount();
        reassignIDs(); 
        eventSetter();
    }, 550)
    task_count --;
    
    // this.parentElement.parentNode.removeChild(this.parentElement);
}

function changeProgress(){
    // console.log("hello");
    var parentCard = this.parentElement;
    var status = parentCard.classList[1];
    parentCard.classList.remove(status);
    var statusElem = parentCard.children[2];
   
    if(status == 'not-started'){
        parentCard.classList.add('In-progress');
        statusElem.innerHTML="In-progress";
        statusElem.classList.remove(statusElem.classList[1]);
        statusElem.classList.add('color-blue');

    }
    else if(status =='Completed'){
        parentCard.classList.add('In-progress');
        statusElem.innerHTML="In-progress";
        statusElem.classList.remove(statusElem.classList[1]);
        statusElem.classList.add('color-blue');
    }
    else{
        parentCard.classList.add('Completed');
        statusElem.innerHTML="Completed";
        statusElem.classList.remove(statusElem.classList[1]);
        statusElem.classList.add('color-green');
    }
}

completeAll.addEventListener('click', function(){
    var progress_buttons = document.getElementsByClassName('status-icon');
    for(p of progress_buttons){
        var parentCard = p.parentElement;
        var status = parentCard.classList[1];
        parentCard.classList.remove(status);
        var statusElem = parentCard.children[2];
        parentCard.classList.remove(status);
        parentCard.classList.add("Completed");
        statusElem.innerHTML="Completed";
        statusElem.classList.remove(statusElem.classList[1]);
        statusElem.classList.add('color-green');
    }
});

clearComplete.addEventListener('click', function(){
    let cards = document.getElementsByClassName('Completed');
    let parent = cards[0].parentElement;
    let length = cards.length;
    let count=length-1;
    intervalID = setInterval(function(){
        cards[count].classList.add('delete-card');
        task_count--;
        setTimeout(function(){
            this.parentNode.removeChild(this); 
            updateTaskCount();
      }.bind(cards[count]),500 )
        count--;
        if(count<0){
            clearInterval(intervalID);
        }
    }, 500);
    

});
showAll.addEventListener('click',function(){
    
    if(showState !='showAll'){
        resetColor();
        this.style.color="black";
        var allCards = document.getElementsByClassName('task-card');
        // allCards[0].style.display = "none";
        for(card of allCards){
            card.style.display = "flex";
        }
        showState ='showAll';
    }
});



showComplete.addEventListener('click',function(){
    
    if(showState !='showComplete'){
        resetColor();
        this.style.color="black";
        var allCards = document.getElementsByClassName('task-card');
        // allCards[0].style.display = "none";
        for(card of allCards){
            if(card.classList[1]!='Completed')
                card.style.display = "none";
            else
                card.style.display = "flex";
        }
        showState = 'showComplete';
    }
});

showInprogress.addEventListener('click',function(){

    if(showState !='showInprogress'){
        resetColor();
        this.style.color="black";
        var allCards = document.getElementsByClassName('task-card');
        // allCards[0].style.display = "none";
        for(card of allCards){
            if(card.classList[1]!='In-progress')
                card.style.display = "none";
            else
                card.style.display = "flex";
        }
        showState = 'showInprogress';
    }
});
showNotStarted.addEventListener('click',function(){

    if(showState !='showNotStarted'){
        resetColor();
        this.style.color="black";
        var allCards = document.getElementsByClassName('task-card');
        // allCards[0].style.display = "none";
        for(card of allCards){
            if(card.classList[1]!='not-started')
                card.style.display = "none";
            else
                card.style.display = "flex";
        }
        showState = 'showNotStarted';
    }
});