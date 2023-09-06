import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import { prisma } from '@/lib/prisma'
import { useRouter } from 'next/router'



export default function Home({data}) {

  const [form, setForm] = useState({title:'', content: '', id: ''})
  const router = useRouter()

  function refreshData() {
    router.replace(router.push)
  }

  async function create(data) {
    try {
      const response = await fetch('api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        
        setForm({ title: '', content: '', id: '' });
        refreshData();
      } else {
        console.error('Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  async function deleteNote(id) {
    try {
      const res = await fetch(`api/note/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'DELETE'
      }).then(() => {
        refreshData()
      })
    } catch (error) {
      console.log(error);
    }
  }
  

  const handleSubmit = async (data) => {
    try {
     await create(data);
    } catch (error) {
      console.log(error);
    }
  } 
  return (
    <div >

      <h1 className='text-center font-bold text-3xl mt-4'>Notes</h1>

      <form onSubmit={e => {
        e.preventDefault();
        handleSubmit(form)
      }} className='w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch'>
        <input type="text" 
           placeholder='Title'
           value={form.title}
           onChange={(e) => setForm({...form, title: e.target.value})}
           className='border-2 rounded border-gray-400 p-1'
        />

        <textarea  
           placeholder='Content'
           value={form.content}
           onChange={(e) => setForm({...form, content: e.target.value})}
           className='border-2 rounded border-gray-400 p-1'
        />

        <button type='submit' className='bg-blue-500 text-white py-1 rounded-lg'>
          Add
        </button>
      </form>

      <div className='w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-start'>
        <ul>
          {
            data?.map(item => {
              return (
                <li key={item.id} className='border-b border-gray-600 p-2'>
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold">
                        {item.title}
                      </h3>
                      <p className="text-sm">{item.content}</p>
                    </div>
                   
                    <button onClick={() => deleteNote(item.id)} className='bg-red-500 px-3 rounded'>X</button>
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>

    
  )
}

export const getServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      title: true,
      id: true,
      content: true,
    },
  });
  console.log(notes);
  return {
    props: {
      data: notes
    },
  };
};
