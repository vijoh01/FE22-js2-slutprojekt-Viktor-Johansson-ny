import { storeUser } from "./auth";

const fetcher = async ({ header, method, body, json = true }) => {
    const init = {
        headers: {
            Accept: "application/json",
            "Content-type": "application/json"
        },
        body: body && JSON.stringify(body),
        method,
    }

    const res = await fetch(process.env.DATABASE_URL + `${header}.json`, init);
    if (!res.ok) {
        throw alert("API failed to fetch");
    }

    if (json) {
        return await res.json();
    }
};

interface User {
    email: string,
    password: string,
    username: string,
    img: string,
    posts: { text: string }[]
  }
  
export const getId = async (user: User) => {
    const existingUsers = await getUsers();
    const values: object = Object.values(existingUsers);
    return Object.getOwnPropertyNames(existingUsers).filter((usr: string, index) => {
        if (values[index].email === user.email) {
            return usr;
        }
    });
}

export const getPostsFromUser = async (user: User) => {
    const usr: User = await findUserFromEmail(user.email);
    return usr.posts;
}

export const uploadPost = async (user: User, post: {text:string}) => {
    const posts:{text:string}[] = await getPostsFromUser(user)

    const arr = posts != null ? posts : [];

    arr.push(post);

    user.posts = arr;
    console.log(await getId(user));

    return fetcher({
        header: `users/${await getId(user)}`,
        method: "PATCH",
        body: user,
        json: true,
    });
}

export const getUsers = async () => {
    return (await fetcher({
        header: "users",
        method: "GET",
        body: null,
        json: true,
    }));
}

export const findUserFromEmail = async (email: string) => {
    const existingUsers = await getUsers();
    const userArr: Array<User> = Object.values(existingUsers);
    const emailExists = userArr.filter(user => user.email === email);
    return emailExists[0];
}

export const register = async (user: User) => {
    const existingUsers: User = await getUsers();

    if (existingUsers !== null) {
        const emailExists = Object.values(existingUsers).find(
            (u: User) => u.email === user.email || u.username === user.username
        );
        if (emailExists) {
            return alert("Email or username already exists");
        }
    }

    storeUser(user.email);

    window.location.href = "../index.html";

    return fetcher({
        header: "users",
        method: "POST",
        body: user,
        json: true,
    });
};

export const deleteUser = async (user: User) => {
    return fetcher({
        header: `users/${await getId(user)}`,
        method: "DELETE",
        body: null,
        json: true,
    });

};

export const signin = async (user: User, navigate: boolean) => {
    const existingUsers: User = await getUsers();

    const emailExists = Object.values(existingUsers).filter(
        (u: User) => { if (u.email === user.email && u.password === user.password/*comparePasswords(u.password, user.password)*/) return u; }
    );


    if (emailExists.length === 0) {
        alert("User not found");
        return;
    }


    storeUser(user.email);
    if (navigate)
        window.location.href = "../index.html";

    return user;
};
