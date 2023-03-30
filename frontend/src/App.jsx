import { createResource, createSignal, onMount } from 'solid-js';
import { request } from './reqeuest';
import AddTask from './components/addTask';
import AddColumn from './components/addColumn';

function App() {
  var [kanban, setKbn] = createSignal(null)
  const [beforeDragPos, setBeforeDragPos] = createSignal()

  onMount(async () => {
    const cols = await (await request('api/column/all', 'GET', null)).json()
    const kbn = new jKanban({ 
      element: '#kanban', 
      boards:  cols,

      dragItems:  true,
      dragBoards: true,
      widthBoard       : '350px',
      itemHandleOptions: {
        enabled             : false,                                 
        handleClass         : "item_handle",
        customCssHandler    : "drag_handler",
        customCssIconHandler: "drag_handler_icon",
        customHandler       : "<span class='item_handle'>+</span> %title% "
      },

      itemAddOptions: {
        enabled: true,
        content: '+',
        class: 'kanban-title-button btn btn-default btn-xs flex w-full justify-center bg-[#3b71ca] text-white ',
        footer: true
      },  
      
      dragEl: function (el, source) {
        setBeforeDragPos([...el.parentElement.children].indexOf(el) + 1)
      },

      dropEl: async function (el, target, source, sibling) {
        const new_id_col  = target.parentNode.attributes['data-id'].value 
        let   old_id_col  = source.parentNode.attributes['data-id'].value
        const item_id     = el.attributes['data-eid'].value

        let from_position = beforeDragPos()
        let to_position   = [...el.parentElement.children].indexOf(el) + 1

        // Si changement de colone alors on attribute l'ancien id au nouveau (id de la colone) 
        // -> envoi du old dans la requête plus bas
        if(new_id_col != old_id_col){ 
          old_id_col = new_id_col
        }

        console.log(to_position);
        
        const response = await (await request('api/task/position', 'PATCH', {task_id: item_id, col_id: old_id_col, from_pos: from_position, to_pos: to_position}))
          
      },

      buttonClick: function(el, boardId) {
        // create a form to enter element
        var formItem = document.createElement("div");
        formItem.setAttribute("class", "itemform w-full");

        formItem.innerHTML =
          `<div class="form-group">
            <input class="form-control w-full rounded" rows="2" autofocus></input>
          </div>`;

        kbn.addForm(boardId, formItem);

        formItem.addEventListener("keypress", async function(e) {
          if(e.key === 'Enter'){
            const response = await (await request('api/task', 'POST', {title: e.target.value, col_id: boardId})).json()
            
            await kbn.addElement(boardId, {
              id:    response.id,
              title: e.target.value,
              position: kbn.options.boards.length + 1
            }, kbn.options.boards.length )
            
            const item =  document.querySelectorAll('[data-eid="' + response.id + '"]')[0]
            addActionsButton(item)
            formItem.parentNode.removeChild(formItem);   
          }
        });
      },

      dragendBoard: async function (el) {
        const index = [...el.parentElement.children].indexOf(el) + 1
        const col_id = el.attributes['data-id'].value
        const response = await (await request('api/column/position', 'PATCH', {col_id: col_id, position: index})).json()
      }, 
    })
    
    addDeleteBtnToTask()
    setKbn(kbn)
  })

  const deleteButton = (item_id) => {
    const btn = document.createElement('button')
    btn.innerText = '-'
    btn.value     = item_id
    btn.classList.add('bg-red-600', 'rounded-full', 'px-2', 'text-white', 'mx-1')
    btn.onclick = async () => {
      const response = await (await request('api/task', 'DELETE', {id: item_id})).json()
      kanban().removeElement(item_id)
    }
    return btn

  }

  const updateTaskButton = (id, item) => {
    const btn = document.createElement('button')
    btn.innerText = 'u'
    btn.classList.add('bg-orange-600', 'rounded-full', 'px-2', 'text-white', 'mx-1')
    btn.onclick = async () => {
      const response = await (await request('api/task', 'PATCH', {id: id, title: item.value})).json()
    }
    return btn
  }

  const addActionsButton = (item) => {
    const id = item.attributes['data-eid'].value
    const value = item.innerHTML

    const input = document.createElement('textarea')
    input.classList.add('w-fit')

    input.value = value
    item.innerHTML = ''
    item.appendChild(input)

    const actions = document.createElement('div')
    actions.classList.add('flex', 'justify-around', 'w-fit')

    const container = document.createElement('div')
    container.classList.add('flex', 'items-center')

    container.appendChild(deleteButton(id))
    container.appendChild(updateTaskButton(id, input))
    
    actions.appendChild(container)
    item.appendChild(actions)

    item.classList.add('flex', 'justify-between')
  }

  const addDeleteBtnToTask = () => {
    const drag_container = document.querySelectorAll('.kanban-drag')

    for(let drag of drag_container){
      for(let item of drag.children){
        addActionsButton(item)
      }
    }
  }


  return (
    <main class='container mx-auto'>
      <nav class='flex w-full justify-center py-5'>
        <p class='text-2xl	font-semibold'>Kanban</p>
      </nav>

      <section>
        <AddTask  kbn={kanban} />
        <div className="flex">
          <div id='kanban' class="my-5"></div>
          <AddColumn kbn={kanban()} />
        </div>
        

      </section>
    </main>
  );
}

export default App;
