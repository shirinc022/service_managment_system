import React, { useEffect, useState } from 'react'
import ServiceCard from './ServiceCard'
import { listServices } from '../../services/userservices'

function Services() {

    const [services,setservices]=useState([])

    useEffect(()=>{
        listServices().then((res)=>{
            console.log(res.data.services,"response");
            setservices(res.data.services)
           
        }).catch((err)=>{
            console.log(err);
            
        })

    },[])




  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-2 p-7'>
       {
        services.map((service,i)=>(
            <ServiceCard key={i} service={service} />
        ))
       }
    
 
</div>
  )
}

export default Services
