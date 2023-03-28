import { createResource, createSignal, onMount } from 'solid-js';
import { request } from './reqeuest';
import AddTask from './components/addTask';
import AddColumn from './components/addColumn';

function App() {
  var [kanban, setKbn] = createSignal(null)

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
      }
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
