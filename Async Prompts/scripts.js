function wait(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function destroyPopup(popup) {
  popup.classList.remove("open");
  await wait(1000);
  //remove popup
  popup.remove();
  popup = null;
}

function ask(options) {
  return new Promise(function (resolve, reject) {
    //we need to create a popup with all the fields in it
    const popup = document.createElement("form");
    popup.classList.add("popup");
    popup.insertAdjacentHTML(
      "afterbegin",
      `<fieldset>
            <label>${options.title}</label>
            <input type="text" name="input"/>
            <button type="submit">Submit</button>
        </fieldset>
        `
    );

    console.log(popup);
    //check if they want a cancel button
    if (options.cancel) {
      const skipButton = document.createElement("button");
      skipButton.type = "button";
      skipButton.textContent = "cancel";
      popup.firstElementChild.appendChild(skipButton);
      //TODO: listen for a click on that cancel button
      skipButton.addEventListener(
        "click",
        function () {
          resolve(null);
          destroyPopup(popup);
        },
        { once: true }
      );
    }

    //listen for the submit event on the inputs
    popup.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        resolve(e.target.input.value);
        console.log("submitted");
        //remove it from the dom entirely
        destroyPopup(popup);
      },
      { once: true }
    );
    //when someone does submit it resolve the data that was in the input box

    //insert that popup on the dom
    document.body.appendChild(popup);
    //we add a small timeout before we add the open class so there is time to have a transition
    setTimeout(function () {
      popup.classList.add("open");
    }, 10);
  });
}

async function askQuestion(e) {
  const button = e.currentTarget;
  const cancel = "cancel" in button.dataset;

  const answer = await ask({ title: button.dataset.question, cancel: true });
  console.log(answer);
}

//select all buttons
const buttons = document.querySelectorAll("[data-question");
buttons.forEach((button) => button.addEventListener("click", askQuestion));

const questions = [
  { title: "What is your name?" },
  { title: "What is your age?", cancel: true },
  { title: "What is your cat's name?" },
];

async function asyncMap(array, callback) {
  const results = [];
  for (const item of array) {
    results.push(await callback(item));
  }
  return results;
}

async function go() {
  const answers = await asyncMap(questions, ask);
  console.log(answers);
}

go();
