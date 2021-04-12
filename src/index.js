document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById("table-body")
  tableBody.addEventListener("click", renderDogInEditForm)
  
  fetchDogsAndRender()

  const editForm = document.getElementById("dog-form")
  editForm.addEventListener("submit", event => {
    event.preventDefault()
    console.log(event.target)
    let edittedData = {
      name: editForm.name.value,
      breed: editForm.breed.value,
      sex: editForm.sex.value
    }
    
    fetch(`http://localhost:3000/dogs/${event.target.dataset.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': "application/json"
      },
      body: JSON.stringify(edittedData)
    })
    .then(resp => resp.json())
    .then(dogObj => {
      const table = document.getElementById("table-body")
      const button = table.querySelector(`[data-id='${dogObj.id}']`)
      const tableRow = button.closest("tr")
      tableRow.innerHTML = `
        <td class="padding center">${dogObj.name}</td>
        <td class="padding center">${dogObj.breed}</td>
        <td class="padding center">${dogObj.sex}</td>
        <td class="padding center"><button class="edit-button" data-id=${dogObj.id}>Edit Dog</button></td>
      `
      table.querySelector(`[data-id='${dogObj.id}']`).focus()
    })
    .catch(() => alert('Please select a dog from the provided list'))

    editForm.dataset.id = ""
    editForm.reset()    
  })  

})

const renderDogOnTable = dogObj => {
  const tableRow = document.createElement("tr")
  tableRow.innerHTML = `
    <td class="padding center">${dogObj.name}</td>
    <td class="padding center">${dogObj.breed}</td>
    <td class="padding center">${dogObj.sex}</td>
    <td class="padding center"><button class="edit-button" data-id=${dogObj.id}>Edit Dog</button></td>
  `
  const tableBody = document.getElementById("table-body")
  tableBody.append(tableRow)
}

const fetchDogsAndRender = () => {
  fetch('http://localhost:3000/dogs')
    .then(resp => resp.json())
    .then(arrOfDogObjs => arrOfDogObjs.forEach(dogObj => {
      renderDogOnTable(dogObj)
    }))
}

const renderDogInEditForm = event => {
  const editForm = document.getElementById("dog-form")
  if (event.target.className === "edit-button"){
    fetch(`http://localhost:3000/dogs/${event.target.dataset.id}`)
    .then(resp => resp.json())
    .then(dogObj => {
      editForm.name.value = dogObj.name
      editForm.breed.value = dogObj.breed
      editForm.sex.value = dogObj.sex
      editForm.dataset.id = dogObj.id
      editForm.name.focus()
    })
  }
}

const editDog = (dogId, edditedData) => {
  fetch(`http://localhost:3000/dogs/${dogId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      "Accept": 'application/json'
    },
    body: JSON.stringify(edditedData)
  })
  
}
