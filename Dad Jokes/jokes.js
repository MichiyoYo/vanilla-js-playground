const jokeButton = document.querySelector(".getJoke");
const jokeButtonSpan = document.querySelector(".jokeText");
const jokeHolder = document.querySelector(".joke p");
const loader = document.querySelector(".loader");

const buttonText = [
  "Ugh. 👎",
  "🤦🏻‍♂️",
  "omg dad.",
  "you are the worst",
  "seriously??",
  "stop it.",
  "please stop 🛑",
  "that was the worst one",
];

async function fetchJoke() {
  loader.classList.remove("hidden");
  const response = await fetch("https://icanhazdadjoke.com", {
    headers: {
      Accept: "application/json",
    },
  });
  const data = await response.json();
  loader.classList.add("hidden");
  return data;
}

function randomItemFromArray(array, not) {
  const item = array[Math.floor(Math.random() * array.length)];
  if (item === not) {
    randomItemFromArray(array, not);
  }
  return item;
}

async function handleClick() {
  //desrtucture the returned data into the variable joke cause I just want that value
  const { joke } = await fetchJoke();
  jokeHolder.textContent = joke;
  jokeButtonSpan.textContent = randomItemFromArray(
    buttonText,
    jokeButtonSpan.textContent
  );
}

jokeButton.addEventListener("click", handleClick);
