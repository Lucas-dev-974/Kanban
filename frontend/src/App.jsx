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

      itemAddOptions: {
        enabled: true,                                              // add a button to board for easy item creation
        content:  '+' ,   
        class: 'kanban-title-button btn btn-default btn-xs',         // default class of the button
        footer: false                                                // position the button on footer
      },
      dragEl: function (el, source) {
        setBeforeDragPos([...el.parentElement.children].indexOf(el) + 1)
      },

      dropEl: async function (el, target, source, sibling) {
        const new_id_col  = target.parentNode.attributes['data-id'].value 
        const old_id_col  = source.parentNode.attributes['data-id'].value
        const item_id     = el.attributes['data-eid'].value

        let from_position = beforeDragPos()
        let to_position = [...el.parentElement.children].indexOf(el) + 1


        const lenBoard = el.parentNode.children.length

        if(new_id_col != old_id_col){
          console.log('changement de colone');
          const response = await (await request('api/column/switch', 'POST', {task_id: item_id, new_col_id: new_id_col})).json()
          return true
        }else{      
          console.log('from position: ', from_position)
          console.log('to   position: ', to_position)
          const response = await (await request('api/task/update-position', 'POST', {task_id: item_id, col_id: old_id_col, from_pos: from_position, to_pos: to_position}))
        }
          
      },
    })
    
    setKbn(kbn)
  })

  return (
    <main class='container mx-auto'>
      <nav class='flex w-full justify-center py-5'>
        <p class='text-2xl	font-semibold'>Kanban</p>
      </nav>

      <section>
        <AddTask  kbn={kanban()} />
        <div className="flex">
          <div id='kanban' class="my-5"></div>
          <AddColumn kbn={kanban()} />
        </div>
        

      </section>
    </main>
  );
}

export default App;
