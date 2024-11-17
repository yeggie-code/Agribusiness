import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Link } from "react-router-dom";


const Home = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bills"));
        const billsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBills(billsList);
      } catch (error) {
        console.error("Error fetching bills: ", error);
      }
    };

    fetchBills();
  }, []);

  return (
    <>
      <h1 style={{color: "green"}}>Upcoming Agricultural Bills</h1>
      <div style={{ marginBottom: "100%", height: "130px"}}>
        <ul style={{listStyle: "none"}}>
          {bills.map(bill => (
            <li key={bill.id}>
              <h2>{bill.title}</h2>
              <Link to={`/bill/${bill.id}`}>Read more</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Home;