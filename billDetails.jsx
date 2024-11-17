import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, increment, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { GoogleGenerativeAI } from "@google/generative-ai";

const BillDetail = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const docRef = doc(db, "bills", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBill(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching bill: ", error);
      }
    };

    fetchBill();
  }, [id]);

  useEffect(() => {
    const commentsRef = collection(db, "bills", id, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsList);
    });

    return () => unsubscribe();
  }, [id]);

  const handleExplain = async () => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyAZNMZ2pynznD9eOseX7fEUPS3l5h_YVlY");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Explain the following bill in simple terms: ${bill.description}`;

      const result = await model.generateContent(prompt);
      setExplanation(result.response.text());
    } catch (error) {
      console.error("Error fetching explanation: ", error.response ? error.response.data : error.message);
      setExplanation("Failed to fetch explanation.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    try {
      const docRef = doc(db, "bills", id);
      await updateDoc(docRef, {
        upvotes: increment(1)
      });
      setBill(prevBill => ({ ...prevBill, upvotes: prevBill.upvotes + 1 }));
    } catch (error) {
      console.error("Error upvoting bill: ", error);
    }
  };

  const handleDownvote = async () => {
    try {
      const docRef = doc(db, "bills", id);
      await updateDoc(docRef, {
        downvotes: increment(1)
      });
      setBill(prevBill => ({ ...prevBill, downvotes: prevBill.downvotes + 1 }));
    } catch (error) {
      console.error("Error downvoting bill: ", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    try {
      const commentsRef = collection(db, "bills", id, "comments");
      await addDoc(commentsRef, {
        text: newComment,
        author: "Anonymous",
        createdAt: new Date()
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  if (!bill) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{}}>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <h1 style={{paddingRight: "150px" ,color:"black"}}>{bill.title}</h1>
        <button onClick={handleExplain} disabled={loading}>
          {loading ? "Loading..." : "Explain this bill"}
        </button>
      </div>
      <p style={{backgroundColor: "black" ,color: "white"}}>{bill.description}</p>
      {explanation && (
        <div>
          <h2>Explanation</h2>
          <p style={{ alignItems: "center", backgroundColor: "black", color: "white", padding: "20px"}}>{explanation}</p>
        </div>
      )}
      <div style={{display: "flex", alignItems: "center", gap: "20px"}}>
        <button style={{ background: "green" }} onClick={handleUpvote}>Upvote</button>
        <span style={ { backgroundColor: "black" ,color : "white"}}>{bill.upvotes}</span>
        <button style={{ background: "red" }} onClick={handleDownvote}>Downvote</button>
        <span style={ { backgroundColor: "black" ,color : "white"}}>{bill.downvotes}</span>
      </div>
      <div>
        <h2 style={{ color: " white"}}>Comments</h2>
        <form onSubmit={handleAddComment} style={{display: "flex", alignItems: "center", gap: "20px"}}>
          <input
            style={{ color: "black", background: "#fff", height: "30px", borderRadius: 100, width: "70%",}}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button type="submit">Submit</button>
        </form>
        <ul style={{listStyle: "none"}}>
          {comments.map(comment => (
            <li key={comment.id} style={{borderBottom: "2px solid white"}}>
              <p><strong>{comment.author}</strong>: {comment.text}</p>
              <p><small>{new Date(comment.createdAt.seconds * 1000).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BillDetail;