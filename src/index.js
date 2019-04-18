// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

//JS MANTRA
// When <some event> happens, I want to make a <what kind of> fetch and then manipulate the DOM <in what way?>


// When **The DOM Loads** happens, I want to make a **GET** fetch and then manipulate the DOM **by rendering all the quotes**

BASE_URL = "http://localhost:3000/quotes/"

document.addEventListener("DOMContentLoaded", () => {
  let quoteUl = document.querySelector("#quote-list")
  let formEl = document.querySelector("#new-quote-form")
  formHandler(formEl, quoteUl)
  fetchQuotes(quoteUl)

})

const fetchQuotes = (quoteUl) => {
  fetch(BASE_URL)
  .then(resp => resp.json())
  .then(quotes => {
    quotes.forEach(quoteObj => {
      quoteUl.innerHTML += renderQuotes(quoteObj)
    })

  })
}

const renderQuotes = (quoteObj) => {
  return (`
    <div id="quote-div-${quoteObj.id}">
      <li class='quote-card'>
        <blockquote class="blockquote">
          <p class="mb-0">${quoteObj.quote}</p>
          <footer class="blockquote-footer">${quoteObj.author}</footer>
          <br>
          <button class='btn-success' data-id=${quoteObj.id}>Likes: <span>${quoteObj.likes}</span></button>
          <button class='btn-danger' data-id=${quoteObj.id}>Delete</button>
        </blockquote>
      </li>
    </div>`)

    deleteHandler()
    likeHandler()
}

// When **form submit** happens, I want to make a **POST** fetch and then manipulate the DOM **by adding the quote to our quoteUl**

const formHandler = (formEl, quoteUl) => {
  formEl.addEventListener("submit", (e) => {
    e.preventDefault()
    let quoteInput = e.target.querySelector("#new-quote").value
    let authorInput = e.target.querySelector("#author").value
    postQuote(quoteInput, authorInput, quoteUl)
  })
}

const postQuote = (quoteInput, authorInput, quoteUl) => {
  fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      quote: quoteInput,
      author: authorInput,
      likes: 0
    })
  })
  .then(resp => resp.json())
  .then(newQuote => {
    quoteUl.innerHTML += renderQuotes(newQuote)
  })
}

// When **click on delete button** happens, I want to make a **DELETE** fetch and then manipulate the DOM **by removing the quote from the DOM**

const deleteHandler = () => {
  document.addEventListener("click", (e) => {
    if (e.target.classList.value === "btn-danger") {
      let quoteId = parseInt(event.target.getAttribute("data-id"))
      //optimistically render here
      deleteFetch(quoteId)
    }
  })
}

const deleteFetch = (id) => {
  fetch(BASE_URL + `${id}`, {
    method: "DELETE"
  })
  //pessimestically render here
  let quoteDiv = document.querySelector(`#quote-div-${id}`)
  quoteDiv.innerHTML = ""

  //could've found based on this but super ugly
  // e.target.parentNode.parentNode.parentNode.dataset.id
}

// When **click on like button** happens, I want to make a **PATCH** fetch and then manipulate the DOM **by incrementing likes**

const likeHandler = () => {
  document.addEventListener("click", (e) => {
    if (e.target.classList.value === "btn-success") {
      let quoteId = parseInt(event.target.getAttribute("data-id"))
      let spanTag = event.target.querySelector('span')
      let currentLikes = parseInt(spanTag.innerText)

      currentLikes++;

      //optimistically rendering
      // spanTag.innerText = currentLikes

      patchFetch(quoteId, currentLikes, spanTag)
    }
  })
}

const patchFetch = (id, likeCount, spanTag) => {
  fetch(BASE_URL + `${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      likes: likeCount
    })
  })
  .then(resp => resp.json())
  .then(quoteObj => {
    // pessimestically rendering
    spanTag.innerText = quoteObj.likes
  })
}
