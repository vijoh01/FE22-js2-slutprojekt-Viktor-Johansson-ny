import { uploadPost, getUsers} from "./lib/api";
import { getCurrentUser } from "./module/login";

import { deleteUser } from "./lib/api";
import { removeUser} from "./lib/auth";

import img0 from '../images/img0.jpg';
import img1 from '../images/img1.jpg';
import img2 from '../images/img2.jpg';

const container = document.querySelector('.container') as HTMLInputElement;

export async function loadUserSignedin() {

    let signinBtn = document.querySelector('.signinBtn') as HTMLInputElement;
    let btns = document.querySelector('.btns') as HTMLInputElement;

    let userSelect = document.createElement('select');
    let userOption = document.createElement('option');

    let userText = document.createTextNode(getCurrentUser().username);
    let uploadBtn = document.querySelector('.upload') as HTMLInputElement;

    userOption.appendChild(userText);
  
    let logoutOption = document.createElement('option');
    let logoutText = document.createTextNode("Logout");
    logoutOption.appendChild(logoutText);
    let deleteOption = document.createElement('option');
    let deleteText = document.createTextNode("Delete");
    deleteOption.appendChild(deleteText);
    userSelect.appendChild(userOption);
    userSelect.appendChild(logoutOption);
    userSelect.appendChild(deleteOption);
  
    btns.appendChild(userSelect);
  
    signinBtn.remove();
    uploadBtn.classList.add('show');

    logoutOption.addEventListener('click', function (e : Event) {
      userSelect.remove();
      console.log("Logging out...");
      btns.append(signinBtn);
      uploadBtn.remove();
      window.location.href = "../index.html";
      removeUser();
    });


    deleteOption.addEventListener('click', async function (e : Event) {
      e.preventDefault();
      await deleteUser(getCurrentUser()).then(a => window.location.href = "../index.html");
    });
  
    if (getCurrentUser().posts != null) {
      getCurrentUser().posts.reverse();
      userOption.addEventListener('click', function (e : Event) {
        loadPostList(getCurrentUser());
      });
    }
  }

function getImage(type: string) {
  let img;
  switch (type) {
    case "img0":
      img = img0;
      break;
    case "img1":
      img = img1;
      break;
    case "img2":
      img = img2;
      break;
  }
  return img;
}

loadUserList();

interface User {
  email: string,
  password: string,
  username: string,
  img: string,
  posts: { text: string }[]
}


async function loadUserList() {
  const existingUsers = await getUsers();

  let userArr: Array<User> = Object.values(existingUsers);
  const list = userArr.sort((a: User, b: User) => {
    
    if (a.posts && b.posts) {
      return b.posts.length - a.posts.length;
    } else if (a.posts) {
      return -1;
    } else if (b.posts) {
      return 1;
    } else {
      return 0;
    }
  });

  list.forEach((users, index) => {
    const postCard = document.createElement('div');
    const post = document.createElement('div');
    post.className = "postLayout card" + index;
    const img = document.createElement('img');
    img.className = "userProfile card" + index;
    img.src = getImage(users.img);
  
    post.append(img);
    postCard.className = "postCard card" + index;

    const title = document.createElement('h3');
    title.className = "post card" + index;
    title.innerText = users.username;

    post.append(title);
    const posts = document.createElement('h4');
    posts.className = "postAmount card" + index;
    if (users.posts == null) {
      posts.innerText = "Posts: none";
    } else {
      posts.innerText = "Posts: " + users.posts.length;
      users.posts.reverse();
    }
    post.append(posts);

    postCard.append(post);
    container.append(postCard);
  })

  if (container !== null)
    container.addEventListener('click', async (e : Event) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as Element;

      list.forEach((user: User, index) => {
        if (target.classList.contains("card" + index)) {
          loadPostList(user);
        }
      });
  });
}

function loadPostList(user: User) {
  container.innerHTML = "<div></div>";

  let userProfile = document.createElement('div');

  const title = document.createElement('h1');
  title.style.textAlign = "center";
  title.innerText = user.username;

  userProfile.append(title);

  const img = document.createElement('img');
  img.className = "userImage";
  img.src = getImage(user.img)
  userProfile.append(img);
  container.append(userProfile);
  userProfile.className = "postContainer";

 
  if (user.posts != null)
  user.posts.forEach(post => {
    let postFrame = document.createElement('div');
    postFrame.className = "postFrame"
    let postText = document.createElement('p');
    postText.innerText = post.text;
    postFrame.append(postText);
    userProfile.append(postFrame);
  })
}

const close = document.querySelector('#close-post') as HTMLInputElement;
const box = document.querySelector('#postBox') as HTMLInputElement;

box.classList.add("hide");
close.addEventListener("click", (e : Event) => {
  box.classList.add("hide");
})

let uploadBtn = document.querySelector('.upload') as HTMLInputElement;

const submit = document.querySelector('#submit-button') as HTMLInputElement;
const text = document.querySelector('#post-text') as HTMLInputElement;

submit.addEventListener("click", async (e : Event) => {
  console.log(text.value);
  await uploadPost(getCurrentUser(), { text: text.value })
  window.location.href = "../index.html";
})

uploadBtn.addEventListener("click", (e : Event) => {
  box.classList.remove("hide");
})