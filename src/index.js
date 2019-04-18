// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

//JS MANTRA
// When <some event> happens, I want to make a <what kind of> fetch and then manipulate the DOM <in what way?>
document.addEventListener('DOMContentLoaded', (event) => {

const quoteUlTag = document.querySelector('#quote-list')

fetchQuotes(quoteUlTag)

const quoteFormTag = document.getElementById("new-quote-form")

formHandler(quoteFormTag, quoteUlTag)

deleteHandler()
likeHandler()
})

const fetchQuotes = (quoteUlTag) => {
  return fetch('http://localhost:3000/quotes')
    .then((response) => {
      return response.json()
    }).then((quotes) => {
      quotes.forEach((quote) => {
        quoteUlTag.innerHTML += renderQuotes(quote)
      })
    })
}

const renderQuotes = (quote) => {
  return `  <li class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success' data-id="${quote.id}">Likes: <span>${quote.likes}</span></button>
      <button class='btn-danger' data-id="${quote.id}">Delete</button>
    </blockquote>
  </li>
`
}

// When a Submit event happens, I want to make a POST request and then manipulate the DOM by rendering the new quote


const formHandler = (quoteFormTag, quoteUlTag) => {
  quoteFormTag.addEventListener('submit', (event) => {
    event.preventDefault();
    // debugger;
    let quotation = event.target.querySelector("#new-quote").value
    let author = event.target.querySelector("#author").value

    let quoteObject = {
      quote: quotation,
      author: author,
      likes: 0
    }
    postRequest(quoteObject, quoteUlTag)

  })
}



const postRequest = (quote, quoteUlTag) => {
  // console.log(quote)
  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(quote)
  }).then((response) => {
    return response.json()
  }).then((newQuote) => {
    quoteUlTag.innerHTML += renderQuotes(newQuote)
  })
}

// When a click event happens, I want to make a DELETE request and then manipulate the DOM by deleting the quote

const deleteHandler = () => {
  document.addEventListener('click', (event) => {
    if(event.target.classList.value === 'btn-danger'){
      let quoteId = event.target.dataset.id
      deleteRequest(quoteId)
    }
  })
}

const deleteRequest = (quoteId) => {
  fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method:'DELETE'
  })
  let currentCard = event.target.parentElement.parentElement
  currentCard.remove()
}

// When a click event happens, I want to make a PATCH request and then manipulate the DOM by increasing the likes in the quote

const likeHandler = () => {
  document.addEventListener('click', (event) => {
    if (event.target.classList.value === 'btn-success') {
      let quoteId = event.target.dataset.id
      let spanTag = event.target.querySelector('span')
      let currentLikes = parseInt(spanTag.innerText)

      currentLikes++;
      patchRequest(quoteId, currentLikes, spanTag)
    }
  })
}

const patchRequest = (quoteId, likes, spanTag) => {
  fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({likes: likes})
  }).then((response) =>{
    return response.json()
  }).then((quoteObj) => {
    spanTag.innerText = quoteObj.likes
  })
}
