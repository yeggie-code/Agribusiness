import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const UploadBill = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const upvotes = 0;
  const downvotes = 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "bills"), {
        title,
        description,
        upvotes,
        downvotes,
        createdAt: new Date()
      });
      setTitle("");
      setDescription("");
      alert("Bill uploaded successfully!");
    } catch (error) {
      console.error("Error uploading bill: ", error);
      alert("Failed to upload bill.");
    }
  };

  return (
    <div style={{ marginBottom: "100%", width: "500px", height: "500px" }}>
      <h1 style={{ color: "green" }}>Upload New Agri-Bill</h1>
      <form onSubmit={handleSubmit} style={{ border:"1px solid white", borderRadius: 50, width: "100%", height: "400px", display: "block", justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "50px" }}>
          <label style={{ paddingRight: "60px" }}>Title:</label>
          <input
            style={{background: "#fff", height: "30px", borderRadius: 100, width: "70%", color: "black"}}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "20px", paddingBottom:"50px"}}>
          <label style={{ paddingRight: "15px" }}>Description:</label>
          <textarea
            style={{background: "#fff", width: "70%", color: "black"}}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={10}
          />
        </div>
        <button style={{ background: "green" }} type="submit">Upload Bill</button>
      </form>
    </div>
  );
};

export default UploadBill;