const ITEMS = {}
const BLACKLIST = []

function language(lang){
    // TODO : Change the page language according to the selected one from its json file in lang folder
}

function editResources(){
    let resources = document.getElementById('resourceslist')
    resources.innerHTML = ''

    let inputs = document.getElementsByClassName('number')

    for(let input of inputs){
        let id = input.id.replace('number ', '')

        if(ITEMS[id][1] != undefined){
            let cost = ITEMS[id][1].split(',')

            cost.forEach(c => {
                let amount = parseInt(c.split('*')[0]) * parseInt(input.value)
                resources.appendChild(itemNode('resources', c.replace(c.split('*')[0], amount), id, `img/item/${c.split('*')[1]}.png`))
            });
        }
    }
}

function checkEdit(id){
    let input = document.getElementById(`number ${id}`)

    if(input.value <= 0)
        input.value = '1'
    
    editResources()
}

function edit(id, n){
    let input = document.getElementById(`number ${id}`)
    input.value = parseInt(input.value) + n

    if(input.value <= 0){
        document.getElementById('itemslist').removeChild(document.getElementById(`items ${id}`))
        delete BLACKLIST[BLACKLIST.indexOf(id)]
        search()
    }
    
    editResources()
}

function addItem(name, id, src){
    BLACKLIST.push(id)
    document.getElementById('itemslist').appendChild(itemNode('items', name, id, src))
    document.getElementById('searchlist').removeChild(document.getElementById(`search ${id}`))
    editResources()
}

function itemNode(list, name, id, src){
    let node = document.createElement('li')

    let infosContainer = document.createElement('div')
    infosContainer.className = 'infos'
    let img = document.createElement('img')
    img.src = src
    let textContainer = document.createElement('div')
    let pName = document.createElement('p')
    pName.innerHTML = name
    let pId = document.createElement('p')
    pId.innerHTML = id

    textContainer.appendChild(pName)
    textContainer.appendChild(pId)
    infosContainer.appendChild(img)
    infosContainer.appendChild(textContainer)

    node.appendChild(infosContainer)

    if(list == 'search'){
        node.id = `search ${id}`
        node.setAttribute('onclick', `addItem('${name}', '${id}', '${src}')`)
    }else if(list == 'items'){
        node.id = `items ${id}`

        let settingsContainer = document.createElement('div')
        settingsContainer.className = 'settings'

        let amount = document.createElement('input')
        amount.value = '1'
        amount.type = 'number'
        amount.id = `number ${id}`
        amount.className = `number ${id}`
        amount.setAttribute('oninput', `checkEdit('${id}')`)

        let buttonsContainer = document.createElement('div')
        let add = document.createElement('button')
        add.setAttribute('onclick', `edit('${id}', 1)`)
        add.innerHTML = '<img src="img/add.svg">'
        let remove = document.createElement('button')
        remove.setAttribute('onclick', `edit('${id}', -1)`)
        remove.innerHTML = '<img src="img/remove.svg">'

        buttonsContainer.appendChild(add)
        buttonsContainer.appendChild(remove)

        settingsContainer.append(amount)
        settingsContainer.append(buttonsContainer)

        node.appendChild(settingsContainer)
    }

    return node
}

function search(){
    let input = document.getElementById('searchbar').value.toLowerCase().replace(' ', '_')
    let searchList = document.getElementById('searchlist')
    searchList.innerText = ''
    
    if(input != '')
        for(let [key, item] of Object.entries(ITEMS))
            if(key.includes(input))
                if(!BLACKLIST.includes(key))
                    searchList.appendChild(itemNode('search', item[0], key, `img/item/${key}.png`))
}

search()