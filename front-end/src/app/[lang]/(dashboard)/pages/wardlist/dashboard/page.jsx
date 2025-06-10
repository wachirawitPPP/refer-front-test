'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useSearchParams, useParams } from 'next/navigation'
const DashBoard = () => {
  const { data: session, status } = useSession()
  const [dataDashBoard, setDataDashBoard] = useState([])
  const fectDashBoardList = async () => {
    if(session) {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/DashboardWardBed`,
        { hptcode: '11539' },
        {
          headers: {
            Authorization: `${session?.user?.token}`
          }
        }
      )
      const data = response.data.data.Result
      console.log(data)
      setDataDashBoard(data)
    } 
  }

  useEffect(() => {
    fectDashBoardList()
  }, [session])
  return (
    <div className='w-full p-4'>
      <div className='w-full bg-white shadow-lg rounded-lg p-4 overflow-x-auto'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <span className='material-icons'>จำนวนเตียงทั้งหมด</span>
        </h2> 
        <table className='w-full border-collapse mt-4 text-center min-w-[600px]'>
          <thead className='sticky top-0'>
            <tr className='bg-gray-200'>
              <th className='p-4 border- text-lg font-bold'>Ward</th>
              <th className='p-4 bg-green-200 text-green-600 border text-lg font-bold'>ว่าง</th>
              <th className='p-4 bg-red-200 text-red-600 border text-lg font-bold'>ไม่ว่าง</th>
              <th className='p-4 bg-sky-200 text-blue-500 border text-lg font-bold'>ทั้งหมด</th>
            </tr>
          </thead>
          <tbody>
            {dataDashBoard.map((item,index) => 
          
              <tr key={item.wardname} className='bg-gray-100 hover:bg-gray-300 '>
                <td className='p-3 border font-medium text-left text-base font-bold'>{item.wardname} </td>
              <td className='p-3 border text-green-600 text-lg font-bold'>
                {item.bedempty}<span className='text-sm font-bold'> </span>
              </td>
              <td className='p-3 border text-red-600 text-lg font-bold'>
              {item.beduse}<span className='text-sm font-bold'> </span>
              </td>
              <td className='p-3 border text-blue-500 text-lg font-bold'>
              {item.bedqty}<span className='text-sm font-bold'> </span>
              </td>
              </tr>
            )}
            {/* <tr className='bg-gray-100 hover:bg-gray-300 '>
              <td className='p-3 border font-medium text-left text-base font-bold'>อายุรกรรมชาย</td>
              <td className='p-3 border text-green-600 text-lg font-bold'>
                5<span className='text-sm font-bold'> </span>
              </td>
              <td className='p-3 border text-red-600 text-lg font-bold'>
                24<span className='text-sm font-bold'> </span>
              </td>
              <td className='p-3 border text-blue-500 text-lg font-bold'>
                29<span className='text-sm font-bold'> </span>
              </td>
            </tr> */}
          </tbody>
        </table> 
      </div>
    </div>
  )
}

export default DashBoard
