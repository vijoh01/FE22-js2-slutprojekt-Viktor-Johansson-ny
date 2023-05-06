import { loadUserSignedin } from "../index";
import { register, signin } from "../lib/api";
import { getUserFromStorage, hasLoggedIn } from "../lib/auth";

const registerUser = document.querySelector('.registerUser') as HTMLInputElement;
const signinUser = document.querySelector('.signinUser') as HTMLInputElement;

interface User {
  email: string,
  password: string,
  username: string,
  img: string,
  posts: { text: string }[]
}

let currentUser;

export function getCurrentUser() {
  return currentUser;
}

if (registerUser != null)
  registerUser.addEventListener("click", async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    await register(getUserData(true));
  })

if (signinUser != null)
  signinUser.addEventListener("click", async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    currentUser = await signin(getUserData(false), true);
    if (getCurrentUser() != null) loadUserSignedin();
  })

async function checkForUser() {
  let usr = await getUserFromStorage();
  if (usr != null)
    if (hasLoggedIn()) {
      currentUser = await signin(usr, false);
      if (getCurrentUser() != null) loadUserSignedin();
    }
}

checkForUser();

function getUserData(register: boolean) {
  const email = document.querySelector('.email') as HTMLInputElement;
  const username = document.querySelector('.username') as HTMLInputElement;
  const password = document.querySelector('.password') as HTMLInputElement;
  var selected = document.querySelector('input:checked') as HTMLInputElement;

  const user: User = {
    email: email.value,
    password: password.value,
    username: "",
    img: "",
    posts: []
  }


  if (register) {
    user["username"] = username.value;
    var className = "";
    className = selected.classList[0];
    user["img"] = className;
  }

  return user;
}