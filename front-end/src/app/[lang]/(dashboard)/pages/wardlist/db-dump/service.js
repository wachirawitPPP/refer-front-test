/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */
'use server'

// Data Imports
// import { db as eCommerceData } from './ecommerce'
 

// export const getEcommerceData = async () => {
//   return eCommerceData
// }

import { db as departments } from './department'
 

export const getDepartment = async () => {
  return departments
}
 