import {useState,useEffect} from 'react';
import axios from 'axios';
import LoadingComponent from '../components/LoadingComponent';
import GoalComponent from '../components/GoalComponent';
import Cookies from "universal-cookie";
const cookies = new Cookies();
const baseURL = "http://localhost:5000/api";

function Dashboard() {
    //this hook deals with user data
    const [user,setUSer] = useState({
        email:'',
        id:'',
        name:''
    });
  //this hook deals with goal data
    const [goals, setGoals] = useState([]);
  //this hook deals with form data
  //@clears form, stores form value to formData 
    const [formData, setFormData] = useState({title:'',task:''});
  //Whenever our front end is in "waiting" state this hook setsoff a spinner
    const [loading, setLoading] = useState(true);
    const token = cookies.get("TOKEN");
  //useEffect sets user name and goals on page load
    useEffect(() => {
      User();
      Goals();
      setLoading(false);
    }, []);

    function User(){
        axios.get(`${baseURL}/users/me`,{ headers: {"Authorization" : `Bearer ${token}`} }
        ).then((response)=>{
                setUSer(response.data);
              }).catch((error)=>{
                    console.log(error);
        })
      };

      function Goals(){
        axios.get(`${baseURL}/goals`,
                  { headers: {"Authorization" : `Bearer ${token}`} }
                  ).then((response)=>{
                        let goalsArray = [];
                        for(let i=0; i < response.data.length ; ++i){
                             goalsArray.push({
                                title:response.data[i].title,
                                text:response.data[i].text,
                                id:response.data[i]._id
                            });
                          }
                          setGoals(goalsArray);
                      }
                    ).catch((error)=>{
                          console.log(error);
                    })
      };

//@form for create goals : This function clears the input field  and sets text value to state
        function onChange(e){
          setFormData((prevState)=>({
            ...prevState, 
              [e.target.name]:e.target.value,
          }))
        };  
  
//@Create goals : text value from above function is sent to backend using axios
    async function createGoals (){
          setLoading(true);
          const config = {headers : {Authorization : `Bearer ${token}`}};
          const response = await axios.post(`${baseURL}/goals`,{text : formData.task,title : formData.title},config);
          const data =  {title : response.data.title,text : response.data.text, id:response.data._id};
          setGoals((prevState)=>([...prevState,data]));
          setLoading(false);
        }
//the setGoal function on backend expects {text : req.user.text,user : req.user.id}
        function onSubmit(e){
            e.preventDefault();
            if(formData.task==='' || formData.title===''){
              window.alert('Please add a text field.');
            }
            else{
              setFormData({title:'',task:''});
              createGoals();
            }
        };

//@UPDATE : /api/goals/id
 async function updateGoal(id){
      if(formData.task===''){
        window.alert('To update a task : type text in the form and click on update icon.')
      }
      else{
        setLoading(true);
        const config = {headers : {Authorization : `Bearer ${token}`}};
        const response = await axios.put(`${baseURL}/goals/${id}`,{text:formData.task,title : formData.title},config);
          if(response.data._id === id){
              let foundIndex = goals.findIndex(goal=>goal.id==id);
              goals[foundIndex] = {title : response.data.title,text : response.data.text, id:response.data._id};
              setGoals(goals);
            }
      }
      setFormData({title:'',task:''});
      setLoading(false);
 };

 //@DELETE : /api/goals/id
 async function deleteGoal(id){
  setLoading(true);
  const config = {headers : {Authorization : `Bearer ${token}`}};
  const response = await axios.delete(`${baseURL}/goals/${id}`,config);
  if(response.data.id === id){
      let newGoals = goals.filter(goal=>goal.id!==id);
      setGoals(newGoals);
    }
    setLoading(false);
}

 if (loading) {
  return <LoadingComponent />;
}

  return (
    <div className='dashboard'>
          <section className='heading'>
            <h1>Welcome {user.name}</h1>
            <p>Goals Dashboard</p>
          </section>

          <section className='form'>
            <form onSubmit={(e)=>onSubmit(e)}>
              <div className='form-group'>
                <input
                  type='text'
                  maxLength={10}
                  className='form-control'
                  id='task'
                  name='title'
                  value={formData.title}
                  placeholder='Title'
                  onChange={onChange}
                />
                <input
                  type='text'
                  maxLength={20}
                  className='form-control'
                  id='task'
                  name='task'
                  value={formData.task}
                  placeholder='Take a note...'
                  onChange={onChange}
                />
              </div>

              <div className='form-group'>
                <button type='submit' className='btn btn-block'>
                    Add goal
                </button>
              </div>
            </form>
          </section>

          {goals[0] ?
            (<div className='goals-container'>
                <GoalComponent props={[goals,deleteGoal,updateGoal]} />
              </div>)
          :
          (<h1>You have no goals.</h1>)
          }
      </div>
  );
}

export default Dashboard;