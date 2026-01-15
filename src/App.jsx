import React, { useState, useEffect } from "react";

const App = () => {
  // PERBAIKAN: Pisahkan soal untuk Tim A dan Tim B
  const [questionsA, setQuestionsA] = useState([]);
  const [questionsB, setQuestionsB] = useState([]);
  const [currentQ, setCurrentQ] = useState({ p1: 0, p2: 0 });
  const [pos, setPos] = useState({ p1: 0, p2: 0 });
  const [loading, setLoading] = useState(true);
  const [winner, setWinner] = useState(null);

  const APPSCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzBwr1UgAdCHc4EcUz9F6QV_tbSuQG6kfsGJYorAuegtnJXCSqccGPv_2JJuX5A2AuPBA/exec";

  // Fungsi helper untuk mengacak array secara independen
  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    fetch(APPSCRIPT_URL)
      .then((res) => res.json())
      .then((data) => {
        // PERBAIKAN: Berikan acakan yang berbeda untuk masing-masing tim
        setQuestionsA(shuffle(data));
        setQuestionsB(shuffle(data));
        setLoading(false);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const handleAnswer = (player, answer) => {
    // PERBAIKAN: Ambil referensi soal berdasarkan player yang menjawab
    const currentQuestions = player === "p1" ? questionsA : questionsB;
    const isCorrect = answer === currentQuestions[currentQ[player]].correct;

    if (isCorrect) {
      setPos((prev) => {
        const newPos = { ...prev, [player]: prev[player] + 10 };
        if (newPos[player] >= 100 && !winner)
          setWinner(player === "p1" ? "TIM A" : "TIM B");
        return newPos;
      });
    }

    // Pindah ke soal berikutnya pada list masing-masing
    setCurrentQ((prev) => ({
      ...prev,
      [player]: (prev[player] + 1) % currentQuestions.length,
    }));
  };

  if (loading)
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white text-2xl">
        <div className="animate-bounce mb-4 text-6xl">🏎️</div>
        Menyiapkan Arena Balap...
      </div>
    );

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col p-4 overflow-hidden font-sans">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-400 italic">
          SPEED RACE QUIZ
        </h1>
      </div>

      <div className="flex flex-1 gap-4">
        {/* Panel TIM A */}
        <div className="flex-1 bg-slate-900 border-2 border-blue-500/30 rounded-3xl p-6 flex flex-col shadow-lg">
          <div className="bg-blue-600 text-white px-4 py-1 rounded-full w-fit mx-auto mb-4 font-bold shadow-lg shadow-blue-500/20">
            TIM A
          </div>
          <div className="flex-1 flex flex-col justify-center text-center">
            {/* PERBAIKAN: Baca dari questionsA */}
            <h2 className="text-xl font-bold mb-8 min-h-[60px]">
              {questionsA[currentQ.p1]?.q}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {questionsA[currentQ.p1]?.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer("p1", opt)}
                  className="bg-slate-800 hover:bg-blue-700 p-4 rounded-xl border border-slate-700 transition-all active:scale-95 text-left flex gap-3 font-medium"
                >
                  <span className="text-blue-400 font-bold">
                    {String.fromCharCode(97 + i)}.
                  </span>{" "}
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Tengah - Balapan Vertikal */}
        <div className="flex-[0.6] bg-slate-900/50 border-x-2 border-slate-800 relative overflow-hidden flex flex-col rounded-xl">
          <div className="flex-1 relative p-4 flex justify-around items-end">
            {/* Jalur A */}
            <div className="h-full w-px bg-blue-500/20 absolute left-1/4"></div>
            <div
              className="absolute transition-all duration-700 ease-out flex flex-col items-center z-10"
              style={{
                bottom: `${pos.p1}%`,
                left: "25%",
                transform: "translateX(-50%)",
              }}
            >
              <div className="bg-blue-500 w-10 h-10 rounded-full shadow-lg shadow-blue-500/50 flex items-center justify-center font-bold text-white border-2 border-white">
                A
              </div>
            </div>

            {/* Jalur B */}
            <div className="h-full w-px bg-red-500/20 absolute right-1/4"></div>
            <div
              className="absolute transition-all duration-700 ease-out flex flex-col items-center z-10"
              style={{
                bottom: `${pos.p2}%`,
                right: "25%",
                transform: "translateX(50%)",
              }}
            >
              <div className="bg-red-500 w-10 h-10 rounded-full shadow-lg shadow-red-500/50 flex items-center justify-center font-bold text-white border-2 border-white">
                B
              </div>
            </div>
          </div>
          <div className="bg-slate-900/80 p-3 text-center text-[10px] text-slate-400 border-t border-slate-800">
            Jawab benar untuk meluncur ke atas!
          </div>
        </div>

        {/* Panel TIM B */}
        <div className="flex-1 bg-slate-900 border-2 border-red-500/30 rounded-3xl p-6 flex flex-col shadow-lg">
          <div className="bg-red-600 text-white px-4 py-1 rounded-full w-fit mx-auto mb-4 font-bold shadow-lg shadow-red-500/20">
            TIM B
          </div>
          <div className="flex-1 flex flex-col justify-center text-center">
            {/* PERBAIKAN: Baca dari questionsB */}
            <h2 className="text-xl font-bold mb-8 min-h-[60px]">
              {questionsB[currentQ.p2]?.q}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {questionsB[currentQ.p2]?.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer("p2", opt)}
                  className="bg-slate-800 hover:bg-red-700 p-4 rounded-xl border border-slate-700 transition-all active:scale-95 text-left flex gap-3 font-medium"
                >
                  <span className="text-red-400 font-bold">
                    {String.fromCharCode(97 + i)}.
                  </span>{" "}
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pemenang */}
      {winner && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border-4 border-yellow-500 p-10 rounded-[3rem] text-center max-w-md shadow-2xl">
            <h2 className="text-6xl mb-4 animate-tada">🏆</h2>
            <h3
              className={`text-4xl font-black mb-2 italic ${
                winner === "TIM A" ? "text-blue-400" : "text-red-400"
              }`}
            >
              {winner} MENANG!
            </h3>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-yellow-500 text-black px-12 py-4 rounded-full font-bold text-xl hover:bg-yellow-400 transition-all hover:scale-105"
            >
              MAIN LAGI
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
