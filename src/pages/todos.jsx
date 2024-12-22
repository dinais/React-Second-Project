import { useEffect } from "react";  
import { useParams } from "react-router-dom";
export default function Todos(){
    const {id} = useParams();
useEffect(async() =>{
    const response =  await fetch(`http://localhost:3000/todos/?userId=${id}`);
    let todos =  await response.json();
    console.log(todos);
    
}
    ,[]
)

return(<>
<h1>Todos</h1>
</>)
}