import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";
import * as XLSX from "xlsx";
import Modal from "react-modal";
import "./LuckyDrawSpinWheel.css"; // Ensure this CSS file is correctly set up
import logo from "./aditya-birla-logo.png"; // Replace with the correct path to your logo

const initialParticipants = [
  { name: "Manoj Awasthi", policy: "009535839" },
  { name: "AJAY SINGH KATIYAR", policy: "009516782" },
  { name: "NITIN TRIPATHI", policy: "009510518" },
  { name: "ANUP KUMAR TIWARI", policy: "009502795" },
  { name: "JUGGI LAL VERMA", policy: "009447831" },
  { name: "Aatm Praksh", policy: "009444567" },
  { name: "DEVENDRA KUMAR", policy: "009431455" },
  { name: "DEVENDRA SINGH KUSHWAH", policy: "009429608" },
  { name: "GYANENDRA KUMAR", policy: "009430053" },
  { name: "SARVESH KUMAR", policy: "009430973" },
  { name: "DEVENDRA DIXIT", policy: "009411848" },
  { name: "Pramod Yadav", policy: "009404172" },
  { name: "Arun Tripathi", policy: "009342051" },
  { name: "AMITABH PORWAL", policy: "009371335" },
  { name: "GUNJAN SHUKLA", policy: "009356908" },
  { name: "PANKAJ TRIPATHI", policy: "009358638" },
  { name: "SHALINI", policy: "009311954" },
  { name: "ABHISHEK VERMA", policy: "009315408" },
  { name: "ARJU MISHRA", policy: "009305535" },
  { name: "Utkarsh Mishra", policy: "009311949" },
  { name: "POORNIMA SINGH", policy: "009308182" },
  { name: "Sanjay Singh", policy: "009309084" },
  { name: "RAJIV KUMAR AGARWAL", policy: "009309088" },
  { name: "SUDHIR TIWARI", policy: "009301787" },
  { name: "NISHA KATIYAR", policy: "009290170" },
];

const colors = [
  "#e63946",
  "#a8dadc",
  "#457b9d",
  "#1d3557",
  "#f4a261",
  "#2a9d8f",
  "#e9c46a",
  "#ff6b6b",
  "#4ecdc4",
];

const LuckyDrawSpinWheel = () => {
  const [participants, setParticipants] = useState(initialParticipants);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null);
  const [winnersList, setWinnersList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winner, setWinner] = useState(null);

  const data = participants.map((participant, index) => {
    const nameParts = participant.name.split(" ");
    const firstName = nameParts[0];
    const lastInitial = nameParts.length > 1 ? nameParts[1][0] : ""; // Get the first letter of the last name

    return {
      option:
        participant.name.length > 10
          ? `${firstName} ${lastInitial}.`
          : participant.name,
      style: { backgroundColor: colors[index % colors.length] },
    };
  });

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * participants.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  const downloadExcel = () => {
    const dataToExport = winnersList.map((winner, index) => ({
      "S. No": index + 1,
      Name: winner.name,
      "Policy Number": winner.policy,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Winners");
    XLSX.writeFile(workbook, "lucky_draw_winners.xlsx");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const removeWinnerFromParticipants = (winner) => {
    const updatedParticipants = participants.filter(
      (participant) => participant.name !== winner.name
    );
    setParticipants(updatedParticipants);
  };

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img
        src={logo}
        alt="Aditya Birla Logo"
        style={{ width: "150px", height: "150px" }}
      />
      <h1>Lucky Draw Spin Wheel</h1>
      <div className="wheel-container" style={{ marginBottom: "20px" }}>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          fontSize={12}
          radiusLineWidth={2}
          backgroundColors={colors}
          textColors={["#ffffff"]}
          spinDuration={0.5} // Optional: Set the duration of the spin
          onStopSpinning={() => {
            setMustSpin(false);
            const winnerData = participants[prizeNumber]; // Get the winner's data
            setWinner(winnerData); // Store the winner's data
            setWinnersList((prevList) => [...prevList, winnerData]);
            removeWinnerFromParticipants(winnerData); // Remove the winner from the list
            setIsModalOpen(true);
          }}
          styles={{ wheel: { width: "500px", height: "500px" } }}
        />
      </div>
      <button
        onClick={handleSpinClick}
        disabled={mustSpin || participants.length === 0}
        className="spin-button"
      >
        {mustSpin ? "Spinning..." : "Spin the Wheel"}
      </button>
      {participants.length === 0 && (
        <p style={{ marginTop: "20px", color: "red" }}>
          No more participants left!
        </p>
      )}
      <br />
      <br />
      <button onClick={downloadExcel} className="download-button">
        Download Winners Excel
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Winner Announcement"
        className="winner-modal"
        overlayClassName="winner-overlay"
      >
        <div className="modal-content">
          <h2 className="winner-title">🎉 Congratulations! 🎉</h2>
          {winner && (
            <>
              <p className="winner-name">Winner: {winner.name}</p>
              <p className="winner-name">Policy Number: {winner.policy}</p>
            </>
          )}
          <button onClick={closeModal} className="close-modal-btn">
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LuckyDrawSpinWheel;
