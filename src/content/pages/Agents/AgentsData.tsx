import { Card } from '@mui/material';
import { Agents } from 'src/models/agents';
import AgentsTable from './AgentsTable';
import { subDays } from 'date-fns';
import axios from 'axios'
import { useEffect } from 'react';

function AgentsData() {

    useEffect(() =>  {
        const fetchData = async () => {
        let data =await  axios.get('https://saas-gw-dev.milgam.co.il:433/gateway/v1/users');
        console.log(data);
        return data;
        }
        fetchData().catch(console.error)
      }, []);

  const Agents: Agents[] = [
    {
        id: '1',
        firstName: 'Eugine',
        lastName: 'Tan',
        phoneNumber: '09260090824',
        userName: 'alwaysonfire',
        emailAddress: 'alwaysonfire2@gmail.com',
        status: 'active',
    },
    {
        id: '2',
        firstName: 'Steve',
        lastName: 'Harvey',
        phoneNumber: '0927318251',
        userName: 'steveH',
        emailAddress: 'steve.harvery@gmail.com',
        status: 'pending',
    },
    {
        id: '3',
        firstName: 'Ryan',
        lastName: 'Reynolds',
        phoneNumber: '0938728312',
        userName: 'ryanrey',
        emailAddress: 'ryanrey@gmail.com',
        status: 'disabled',
    },
    {
        id: '4',
        firstName: 'John Paul',
        lastName: 'Lopez',
        phoneNumber: '0921395023',
        userName: 'jpblopez',
        emailAddress: 'jpblopez@gmail.com',
        status: 'pending',
    },
  ];

  return (
    <Card>
      <AgentsTable Agents={Agents} />
    </Card>
  );
}

export default AgentsData;
