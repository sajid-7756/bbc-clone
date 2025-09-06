const catergoryContainer = document.getElementById("category-container");
const newsContainer = document.getElementById("news-container");
const bookmarkContainer = document.getElementById("bookmark-container");
const newsDetailsModal = document.getElementById("news_details_modal");
const modalContainer = document.getElementById("modal-container");

async function loadCategories() {
  const response = await fetch("https://news-api-fs.vercel.app/api/categories");
  try {
    if (!response.ok) {
      throw new Error("Somthing is problem with the url");
    } else {
      const data = await response.json();
      showCategories(data.categories);
    }
  } catch (error) {
    console.error("There's a problem with fetching the API", error);
  }
}

function showCategories(categories) {
  catergoryContainer.innerHTML = categories
    .map(
      (c) =>
        `<li id="${c.id}" class="text-xl cursor-pointer hover:border-b-4 hover:border-b-red-700">${c.title}</li>`
    )
    .join("");

  catergoryContainer.addEventListener("click", (e) => {
    if (e.target.localName == "li") {
      showLoading(); //show loading spinner
      //Remove hover
      catergoryContainer.querySelectorAll("li").forEach((li) => {
        li.classList.remove("border-b-4", "border-b-red-700");
      });
      //Add border
      e.target.classList.add("border-b-4", "border-b-red-700");

      loadNewsByCategories(e.target.id);
    }
  });
}
// function showCategories(categories) {
//   catergoryContainer.innerHTML = "";
//   categories.forEach((categorie) => {
//     const catagory = document.createElement("li");

//     catagory.textContent = categorie.title;

//     catagory.className =
//       "text-xl cursor-pointer border-b-4 border-b-transparent hover:border-b-red-700";

//     catergoryContainer.appendChild(catagory);

//     // catergoryContainer.innerHTML += `
//     //           <li
//     //         class="text-xl cursor-pointer border-b-4 border-b-transparent hover:border-b-red-700"
//     //       >
//     //         ${categorie.title}
//     //       </li>
//     // `;
//   });
// }

async function loadNewsByCategories(categoryId) {
  const url = `https://news-api-fs.vercel.app/api/categories/${categoryId}
`;
  const response = await fetch(url);
  try {
    const data = await response.json();
    showNewsCategories(data.articles);
  } catch (error) {
    showError();
    throw new Error("Error", error);
  }
}

function showNewsCategories(newses) {
  newsContainer.innerHTML = newses
    .map(
      (news) => `
        <div id="${news.id}" class="card space-y-4">
          <i id="modal" onclick="news_details_modal.showModal()" class="fa-solid fa-circle-info absolute right-2 top-2 text-white text-xl cursor-pointer"></i>
          <img class="w-full" src="${news.image.srcset[5].url}" alt="" />
          <p class="font-semibold">
            ${news.title}
          </p>
          <div class="flex justify-between mx-2">
           <p class="text-gray-600">${news.time}</p>
           <i id="bookmark" class="fa-solid fa-bookmark text-2xl cursor-pointer"></i>
          </div> 
        </div>
    `
    )
    .join("");
  if (newses.length === 0) {
    showEmpty();
  }
  //   newses.forEach((news) => {
  //     console.log(news);

  //     const newsCard = document.createElement("div");
  //     newsCard.classList.add("space-y-4");

  //     newsCard.innerHTML = `
  //               <img src="./55cefe90-8985-11f0-84c8-99de564f0440.jpg.webp" alt="" />
  //             <p class="font-semibold">
  //               অন্তর্বর্তী সরকারের শেষ সময়ে চুক্তি করতে আগ্রহী নয় জাপানি
  //               কনসোর্টিয়াম'
  //             </p>
  //             <p class="text-gray-600">২ সেপ্টেম্বর ২০২৫</p>
  //     `;
  //     newsContainer.appendChild(newsCard);
  //   });
}

function loadNewsDetails(e) {
  const id = e.target.parentNode.id;

  const url = `https://news-api-fs.vercel.app/api/news/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showNewsDetails(data.article);
    })
    .catch((error) => {
      throw new Error("Error: ", error);
    });
}

function showNewsDetails(article) {
  // newsDetailsModal.showModal()

  modalContainer.innerHTML = `
       <div class="modal-box">
          <h3 class="text-lg font-bold">${article.title}</h3>
          <img src="${article.images[0].url}" alt="">
          <p class="py-4">${article.content}</p>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
  `;
}

newsContainer.addEventListener("click", handleNewsContainer);
function handleNewsContainer(e) {
  if (e.target.id === "bookmark") {
    bookmarkContainer.appendChild(e.target.parentNode.parentNode);
  }
  if (e.target.id === "modal") {
    loadNewsDetails(e);
  }
}

bookmarkContainer.addEventListener("click", handleBookmarkContainer);
function handleBookmarkContainer() {
  const card = bookmarkContainer.querySelector(".card");
  if (bookmarkContainer.contains(card)) {
    bookmarkContainer.removeChild(card);
    newsContainer.prepend(card);
  }
}

function showLoading() {
  newsContainer.innerHTML = `
          <div class="flex justify-center col-span-4 mt-50">
          <span class="loading loading-bars loading-xl"></span>
        </div>
  `;
}

function showError() {
  newsContainer.innerHTML = `
          <div class="flex justify-center col-span-4 mt-50">
         <p class="text-red-700">Somthing went wrong...</p>
          </div>
  `;
}

function showEmpty() {
  newsContainer.innerHTML = `
          <div class="flex justify-center col-span-4 mt-50">
         <p class="text-red-700">News Not Found...</p>
          </div>
  `;
}

loadCategories();
loadNewsByCategories("main");
