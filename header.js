

/// initial
const id_header = document.getElementById("header_list");

/// hgroup
const hgroup = document.createElement("hgroup");
hgroup.id = "id_hgroup";
id_header.appendChild(hgroup);

const id_hgroup = document.getElementById("id_hgroup");

// link
const a_home = document.createElement("a");
a_home.href = "https://img-papa.github.io/monooki/";
a_home.id = "header_h1";
id_hgroup.appendChild(a_home);

const header_h1 = document.getElementById("header_h1");

// h1
const h1_title = document.createElement("h1");
header_h1.appendChild(h1_title);

// p
const p_desc = document.createElement("p");
p_desc.textContent = "テンプレート配布サイト";
id_hgroup.appendChild(p_desc);

/// nav
const nav = document.createElement("nav");
nav.id = "id_nav";
id_header.appendChild(nav);

const id_nav = document.getElementById("id_nav");

const nav_ul = document.createElement("ul");
//nav_ul.classList.add("flex");
nav_ul.style.listStyle = "none";
id_nav.appendChild(nav_ul);

// li
const a_list = [
    [ "利用規約", "https://img-papa.github.io/monooki/#top" ],
    [ "テンプレート", "https://img-papa.github.io/monooki/design/#top" ],
    [ "更新履歴", "https://img-papa.github.io/monooki/new.html#top" ],
    [ "お問い合わせ", "" ]
];

const nav_li = document.createElement("li");
nav_ul.appendChild(nav_li);

for ( let i = 0 ; i < a_list.length ; i++ ) {

    const a_nav_li = document.createElement("a");
    a_nav_li.href = a_list[i][1];
    a_nav_li.textContent = a_list[i][0];
    nav_ul.appendChild(a_nav_li);

}