import { useState, useEffect, useCallback } from 'react'

// ============================================
// 🎨 CONFIGURAZIONE E DATI
// ============================================

const ANIMALS = [
  { letter: 'A', name: 'Ape', emoji: '🐝', sound: 'bzz bzz!' },
  { letter: 'B', name: 'Balena', emoji: '🐋', sound: 'splash!' },
  { letter: 'C', name: 'Cane', emoji: '🐕', sound: 'bau bau!' },
  { letter: 'D', name: 'Delfino', emoji: '🐬', sound: 'click click!' },
  { letter: 'E', name: 'Elefante', emoji: '🐘', sound: 'barrr!' },
  { letter: 'F', name: 'Farfalla', emoji: '🦋', sound: 'flutter!' },
  { letter: 'G', name: 'Gatto', emoji: '🐱', sound: 'miao!' },
  { letter: 'H', name: 'Hippo', emoji: '🦛', sound: 'grunt!' },
  { letter: 'I', name: 'Iguana', emoji: '🦎', sound: 'sss!' },
  { letter: 'L', name: 'Leone', emoji: '🦁', sound: 'roar!' },
  { letter: 'M', name: 'Mucca', emoji: '🐄', sound: 'muuu!' },
  { letter: 'N', name: 'Narvalo', emoji: '🐳', sound: 'splash!' },
  { letter: 'O', name: 'Orso', emoji: '🐻', sound: 'grrr!' },
  { letter: 'P', name: 'Panda', emoji: '🐼', sound: 'munch!' },
  { letter: 'Q', name: 'Quaglia', emoji: '🐦', sound: 'chip chip!' },
  { letter: 'R', name: 'Rana', emoji: '🐸', sound: 'cra cra!' },
  { letter: 'S', name: 'Serpente', emoji: '🐍', sound: 'sssss!' },
  { letter: 'T', name: 'Tigre', emoji: '🐯', sound: 'grrroar!' },
  { letter: 'U', name: 'Uccello', emoji: '🐦', sound: 'cip cip!' },
  { letter: 'V', name: 'Volpe', emoji: '🦊', sound: 'yip yip!' },
  { letter: 'Z', name: 'Zebra', emoji: '🦓', sound: 'neigh!' },
]

const COLORS = {
  red: { name: 'Rosso', hex: '#EF4444', emoji: '🔴' },
  orange: { name: 'Arancione', hex: '#F97316', emoji: '🟠' },
  yellow: { name: 'Giallo', hex: '#EAB308', emoji: '🟡' },
  green: { name: 'Verde', hex: '#22C55E', emoji: '🟢' },
  blue: { name: 'Blu', hex: '#3B82F6', emoji: '🔵' },
  purple: { name: 'Viola', hex: '#A855F7', emoji: '🟣' },
  pink: { name: 'Rosa', hex: '#EC4899', emoji: '🩷' },
}

const SHAPES = [
  { name: 'Cerchio', emoji: '⭕', sides: 0 },
  { name: 'Triangolo', emoji: '🔺', sides: 3 },
  { name: 'Quadrato', emoji: '🟥', sides: 4 },
  { name: 'Stella', emoji: '⭐', sides: 5 },
  { name: 'Cuore', emoji: '❤️', sides: 0 },
]

// ============================================
// 🔊 SUONI (Web Audio API)
// ============================================

const useSound = () => {
  const playSound = useCallback((type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      switch(type) {
        case 'correct':
          oscillator.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
          oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1) // E5
          oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2) // G5
          gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
          gainNode.gain.exponentialDecayTo = 0.01
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.4)
          break
        case 'wrong':
          oscillator.frequency.setValueAtTime(200, ctx.currentTime)
          oscillator.frequency.setValueAtTime(150, ctx.currentTime + 0.1)
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.2)
          break
        case 'click':
          oscillator.frequency.setValueAtTime(800, ctx.currentTime)
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.05)
          break
        case 'star':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(880, ctx.currentTime)
          oscillator.frequency.setValueAtTime(1100, ctx.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(1320, ctx.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.3)
          break
        default:
          oscillator.frequency.setValueAtTime(440, ctx.currentTime)
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.1)
      }
    } catch(e) {
      console.log('Audio not supported')
    }
  }, [])
  
  return { playSound }
}

// ============================================
// 🎯 UTILITY FUNCTIONS
// ============================================

const shuffle = (array) => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// ============================================
// 🎮 COMPONENTI UI BASE
// ============================================

function Button({ children, onClick, color = 'blue', size = 'md', disabled, className = '' }) {
  const colors = {
    blue: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
    green: 'bg-green-500 hover:bg-green-600 active:bg-green-700',
    red: 'bg-red-500 hover:bg-red-600 active:bg-red-700',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700',
    purple: 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700',
    pink: 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700',
    orange: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700',
    gray: 'bg-gray-500 hover:bg-gray-600 active:bg-gray-700',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-lg',
    lg: 'px-8 py-4 text-xl',
    xl: 'px-10 py-5 text-2xl',
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${colors[color]} ${sizes[size]}
        text-white font-bold rounded-2xl
        transform transition-all duration-150
        hover:scale-105 active:scale-95
        shadow-lg hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
    >
      {children}
    </button>
  )
}

function Card({ children, onClick, selected, correct, wrong, className = '' }) {
  let stateClasses = 'bg-white hover:bg-gray-50'
  if (selected) stateClasses = 'bg-blue-100 ring-4 ring-blue-400'
  if (correct) stateClasses = 'bg-green-100 ring-4 ring-green-500 animate-bounce'
  if (wrong) stateClasses = 'bg-red-100 ring-4 ring-red-400 animate-shake'
  
  return (
    <div
      onClick={onClick}
      className={`
        ${stateClasses}
        rounded-3xl shadow-lg p-6
        cursor-pointer transform transition-all duration-200
        hover:scale-105 active:scale-95
        ${className}
      `}
    >
      {children}
    </div>
  )
}

function Stars({ count, total = 3 }) {
  return (
    <div className="flex gap-1">
      {[...Array(total)].map((_, i) => (
        <span 
          key={i} 
          className={`text-3xl ${i < count ? 'animate-pulse' : 'opacity-30'}`}
        >
          {i < count ? '⭐' : '☆'}
        </span>
      ))}
    </div>
  )
}

function ProgressBar({ current, total, color = 'blue' }) {
  const percent = (current / total) * 100
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-${color}-500 transition-all duration-500 ease-out`}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

function Confetti() {
  const emojis = ['🎉', '⭐', '🌟', '✨', '🎊', '🏆', '👏', '💫']
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <span className="text-4xl">{emojis[Math.floor(Math.random() * emojis.length)]}</span>
        </div>
      ))}
    </div>
  )
}

// ============================================
// 🏠 MENU PRINCIPALE
// ============================================

function MainMenu({ onSelectGame, progress }) {
  const games = [
    { id: 'numbers', name: 'Conta!', emoji: '🔢', color: 'blue', desc: 'Impara i numeri' },
    { id: 'letters', name: 'ABC Animali', emoji: '🦁', color: 'green', desc: 'Lettere e animali' },
    { id: 'colors', name: 'Colori', emoji: '🎨', color: 'purple', desc: 'Scopri i colori' },
    { id: 'shapes', name: 'Forme', emoji: '🔷', color: 'orange', desc: 'Riconosci le forme' },
    { id: 'memory', name: 'Memory', emoji: '🧠', color: 'pink', desc: 'Allena la memoria' },
    { id: 'spelling', name: 'Scrivi!', emoji: '✏️', color: 'yellow', desc: 'Componi le parole' },
  ]
  
  const totalStars = Object.values(progress).reduce((a, b) => a + b, 0)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-300 p-6">
      {/* Header */}
      <div className="text-center mb-8 pt-4">
        <h1 className="text-5xl font-black text-white drop-shadow-lg mb-2">
          🎮 Impara Giocando!
        </h1>
        <div className="flex items-center justify-center gap-2 text-2xl">
          <span className="text-white font-bold">Le tue stelle:</span>
          <span className="text-yellow-300 font-black">{totalStars}</span>
          <span className="text-3xl">⭐</span>
        </div>
      </div>
      
      {/* Game Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className={`
              bg-white rounded-3xl p-6 shadow-xl
              transform transition-all duration-200
              hover:scale-105 hover:shadow-2xl active:scale-95
              flex flex-col items-center text-center
            `}
          >
            <span className="text-6xl mb-3">{game.emoji}</span>
            <h2 className={`text-xl font-black text-${game.color}-600`}>{game.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{game.desc}</p>
            {progress[game.id] > 0 && (
              <div className="mt-2">
                <Stars count={Math.min(3, Math.floor(progress[game.id] / 3))} />
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Decorative animals */}
      <div className="fixed bottom-4 left-4 text-6xl animate-bounce">🐸</div>
      <div className="fixed bottom-4 right-4 text-6xl animate-bounce" style={{animationDelay: '0.5s'}}>🦋</div>
    </div>
  )
}

// ============================================
// 🔢 GIOCO: CONTA I NUMERI
// ============================================

function NumbersGame({ onBack, onScore }) {
  const { playSound } = useSound()
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  
  const generateQuestion = useCallback(() => {
    const maxNum = Math.min(5 + level * 2, 20)
    const count = randomInt(1, maxNum)
    const emojis = ['🍎', '🌟', '🐱', '🎈', '🍕', '🚗', '⚽', '🌸', '🐶', '🦄']
    const emoji = emojis[Math.floor(Math.random() * emojis.length)]
    
    // Generate wrong answers
    const wrongAnswers = new Set()
    while (wrongAnswers.size < 3) {
      const wrong = randomInt(Math.max(1, count - 3), count + 3)
      if (wrong !== count && wrong > 0) wrongAnswers.add(wrong)
    }
    
    const options = shuffle([count, ...wrongAnswers])
    
    setQuestion({ count, emoji, options })
    setFeedback(null)
  }, [level])
  
  useEffect(() => {
    generateQuestion()
  }, [generateQuestion])
  
  const handleAnswer = (answer) => {
    if (feedback) return
    
    if (answer === question.count) {
      playSound('correct')
      setFeedback('correct')
      setScore(s => s + 1)
      
      if (score + 1 >= 5) {
        setShowConfetti(true)
        onScore('numbers', score + 1)
        setTimeout(() => {
          setLevel(l => l + 1)
          setScore(0)
          setShowConfetti(false)
          generateQuestion()
        }, 2000)
      } else {
        setTimeout(generateQuestion, 1500)
      }
    } else {
      playSound('wrong')
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 1000)
    }
  }
  
  if (!question) return null
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-6">
      {showConfetti && <Confetti />}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBack} color="gray" size="sm">← Menu</Button>
        <div className="text-center">
          <div className="text-white font-bold">Livello {level}</div>
          <Stars count={Math.floor(score / 2)} />
        </div>
        <div className="text-white font-bold text-xl">{score}/5</div>
      </div>
      
      {/* Progress */}
      <div className="max-w-md mx-auto mb-8">
        <ProgressBar current={score} total={5} />
      </div>
      
      {/* Question */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            Quanti {question.emoji} ci sono?
          </h2>
          
          {/* Items display */}
          <div className="flex flex-wrap justify-center gap-3 mb-6 min-h-[120px]">
            {[...Array(question.count)].map((_, i) => (
              <span 
                key={i} 
                className="text-5xl animate-pop"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {question.emoji}
              </span>
            ))}
          </div>
        </div>
        
        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((opt, i) => (
            <Card
              key={i}
              onClick={() => handleAnswer(opt)}
              correct={feedback === 'correct' && opt === question.count}
              wrong={feedback === 'wrong' && opt === question.count}
              className="text-center"
            >
              <span className="text-5xl font-black text-blue-600">{opt}</span>
            </Card>
          ))}
        </div>
        
        {/* Feedback */}
        {feedback && (
          <div className={`
            mt-6 text-center text-3xl font-black
            ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}
            animate-pop
          `}>
            {feedback === 'correct' ? '🎉 Bravissimo!' : '😅 Riprova!'}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// 🦁 GIOCO: ABC ANIMALI
// ============================================

function LettersGame({ onBack, onScore }) {
  const { playSound } = useSound()
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [showAnimalInfo, setShowAnimalInfo] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  
  const generateQuestion = useCallback(() => {
    const shuffled = shuffle(ANIMALS)
    const correct = shuffled[0]
    const wrongLetters = shuffled.slice(1, 4).map(a => a.letter)
    const options = shuffle([correct.letter, ...wrongLetters])
    
    setQuestion({ animal: correct, options })
    setFeedback(null)
    setShowAnimalInfo(false)
  }, [])
  
  useEffect(() => {
    generateQuestion()
  }, [generateQuestion])
  
  const handleAnswer = (letter) => {
    if (feedback) return
    
    if (letter === question.animal.letter) {
      playSound('correct')
      setFeedback('correct')
      setShowAnimalInfo(true)
      setScore(s => s + 1)
      
      if (score + 1 >= 5) {
        setShowConfetti(true)
        onScore('letters', score + 1)
        setTimeout(() => {
          setScore(0)
          setShowConfetti(false)
          generateQuestion()
        }, 3000)
      } else {
        setTimeout(generateQuestion, 2500)
      }
    } else {
      playSound('wrong')
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 1000)
    }
  }
  
  if (!question) return null
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-emerald-600 p-6">
      {showConfetti && <Confetti />}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBack} color="gray" size="sm">← Menu</Button>
        <Stars count={Math.floor(score / 2)} />
        <div className="text-white font-bold text-xl">{score}/5</div>
      </div>
      
      <div className="max-w-md mx-auto mb-8">
        <ProgressBar current={score} total={5} color="green" />
      </div>
      
      {/* Question */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center mb-8">
          <h2 className="text-xl font-bold text-gray-600 mb-4">
            Con che lettera inizia...
          </h2>
          
          <div className="text-8xl mb-4 animate-bounce">
            {question.animal.emoji}
          </div>
          
          <div className="text-3xl font-black text-gray-800">
            {question.animal.name}?
          </div>
          
          {showAnimalInfo && (
            <div className="mt-4 p-4 bg-green-100 rounded-2xl animate-pop">
              <p className="text-2xl">
                <span className="font-black text-green-600">{question.animal.letter}</span> come <span className="font-bold">{question.animal.name}</span>!
              </p>
              <p className="text-lg text-gray-500 mt-1">
                "{question.animal.sound}"
              </p>
            </div>
          )}
        </div>
        
        {/* Letter Options */}
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((letter, i) => (
            <Card
              key={i}
              onClick={() => handleAnswer(letter)}
              correct={feedback === 'correct' && letter === question.animal.letter}
              className="text-center"
            >
              <span className="text-6xl font-black text-green-600">{letter}</span>
            </Card>
          ))}
        </div>
        
        {feedback === 'wrong' && (
          <div className="mt-6 text-center text-3xl font-black text-red-400 animate-shake">
            😅 Riprova!
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// 🎨 GIOCO: COLORI
// ============================================

function ColorsGame({ onBack, onScore }) {
  const { playSound } = useSound()
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  
  const generateQuestion = useCallback(() => {
    const colorKeys = Object.keys(COLORS)
    const shuffled = shuffle(colorKeys)
    const correct = shuffled[0]
    const options = shuffle(shuffled.slice(0, 4))
    
    setQuestion({ color: correct, colorData: COLORS[correct], options })
    setFeedback(null)
  }, [])
  
  useEffect(() => {
    generateQuestion()
  }, [generateQuestion])
  
  const handleAnswer = (colorKey) => {
    if (feedback) return
    
    if (colorKey === question.color) {
      playSound('correct')
      setFeedback('correct')
      setScore(s => s + 1)
      
      if (score + 1 >= 5) {
        setShowConfetti(true)
        onScore('colors', score + 1)
        setTimeout(() => {
          setScore(0)
          setShowConfetti(false)
          generateQuestion()
        }, 2000)
      } else {
        setTimeout(generateQuestion, 1500)
      }
    } else {
      playSound('wrong')
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 1000)
    }
  }
  
  if (!question) return null
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-purple-600 p-6">
      {showConfetti && <Confetti />}
      
      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBack} color="gray" size="sm">← Menu</Button>
        <Stars count={Math.floor(score / 2)} />
        <div className="text-white font-bold text-xl">{score}/5</div>
      </div>
      
      <div className="max-w-md mx-auto mb-8">
        <ProgressBar current={score} total={5} color="purple" />
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center mb-8">
          <h2 className="text-xl font-bold text-gray-600 mb-6">
            Tocca il colore...
          </h2>
          
          <div className="text-4xl font-black mb-4" style={{ color: question.colorData.hex }}>
            {question.colorData.name}
          </div>
          
          <div className="text-6xl animate-pulse">
            {question.colorData.emoji}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((colorKey, i) => (
            <Card
              key={i}
              onClick={() => handleAnswer(colorKey)}
              correct={feedback === 'correct' && colorKey === question.color}
              className="text-center p-8"
            >
              <div 
                className="w-20 h-20 rounded-full mx-auto shadow-lg"
                style={{ backgroundColor: COLORS[colorKey].hex }}
              />
            </Card>
          ))}
        </div>
        
        {feedback && (
          <div className={`
            mt-6 text-center text-3xl font-black
            ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}
            animate-pop
          `}>
            {feedback === 'correct' ? '🎉 Giusto!' : '😅 Riprova!'}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// 🔷 GIOCO: FORME
// ============================================

function ShapesGame({ onBack, onScore }) {
  const { playSound } = useSound()
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  
  const generateQuestion = useCallback(() => {
    const shuffled = shuffle(SHAPES)
    const correct = shuffled[0]
    const options = shuffle(shuffled.slice(0, 4))
    
    setQuestion({ shape: correct, options })
    setFeedback(null)
  }, [])
  
  useEffect(() => {
    generateQuestion()
  }, [generateQuestion])
  
  const handleAnswer = (shapeName) => {
    if (feedback) return
    
    if (shapeName === question.shape.name) {
      playSound('correct')
      setFeedback('correct')
      setScore(s => s + 1)
      
      if (score + 1 >= 5) {
        setShowConfetti(true)
        onScore('shapes', score + 1)
        setTimeout(() => {
          setScore(0)
          setShowConfetti(false)
          generateQuestion()
        }, 2000)
      } else {
        setTimeout(generateQuestion, 1500)
      }
    } else {
      playSound('wrong')
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 1000)
    }
  }
  
  if (!question) return null
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-400 to-orange-600 p-6">
      {showConfetti && <Confetti />}
      
      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBack} color="gray" size="sm">← Menu</Button>
        <Stars count={Math.floor(score / 2)} />
        <div className="text-white font-bold text-xl">{score}/5</div>
      </div>
      
      <div className="max-w-md mx-auto mb-8">
        <ProgressBar current={score} total={5} color="orange" />
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center mb-8">
          <h2 className="text-xl font-bold text-gray-600 mb-6">
            Trova il...
          </h2>
          
          <div className="text-4xl font-black text-orange-600 mb-4">
            {question.shape.name}
          </div>
          
          <div className="text-6xl animate-bounce">
            {question.shape.emoji}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((shape, i) => (
            <Card
              key={i}
              onClick={() => handleAnswer(shape.name)}
              correct={feedback === 'correct' && shape.name === question.shape.name}
              className="text-center"
            >
              <span className="text-6xl">{shape.emoji}</span>
              <p className="text-lg font-bold text-gray-600 mt-2">{shape.name}</p>
            </Card>
          ))}
        </div>
        
        {feedback && (
          <div className={`
            mt-6 text-center text-3xl font-black
            ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}
            animate-pop
          `}>
            {feedback === 'correct' ? '🎉 Esatto!' : '😅 Riprova!'}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// 🧠 GIOCO: MEMORY
// ============================================

function MemoryGame({ onBack, onScore }) {
  const { playSound } = useSound()
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  
  const initGame = useCallback(() => {
    const selectedAnimals = shuffle(ANIMALS).slice(0, 6)
    const pairs = [...selectedAnimals, ...selectedAnimals].map((animal, i) => ({
      ...animal,
      id: i,
    }))
    setCards(shuffle(pairs))
    setFlipped([])
    setMatched([])
    setMoves(0)
    setShowConfetti(false)
  }, [])
  
  useEffect(() => {
    initGame()
  }, [initGame])
  
  const handleCardClick = (index) => {
    if (flipped.length === 2) return
    if (flipped.includes(index)) return
    if (matched.includes(cards[index].letter)) return
    
    playSound('click')
    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)
    
    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [first, second] = newFlipped
      
      if (cards[first].letter === cards[second].letter) {
        playSound('correct')
        setMatched(m => [...m, cards[first].letter])
        setFlipped([])
        
        if (matched.length + 1 === 6) {
          setTimeout(() => {
            playSound('star')
            setShowConfetti(true)
            const stars = moves < 10 ? 3 : moves < 15 ? 2 : 1
            onScore('memory', stars * 2)
          }, 500)
        }
      } else {
        setTimeout(() => {
          setFlipped([])
        }, 1000)
      }
    }
  }
  
  const isFlipped = (index) => flipped.includes(index) || matched.includes(cards[index]?.letter)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-400 to-pink-600 p-6">
      {showConfetti && <Confetti />}
      
      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBack} color="gray" size="sm">← Menu</Button>
        <div className="text-white">
          <span className="font-bold">Mosse: {moves}</span>
        </div>
        <Button onClick={initGame} color="pink" size="sm">🔄</Button>
      </div>
      
      <div className="text-center text-white mb-6">
        <h2 className="text-2xl font-bold">🧠 Memory</h2>
        <p>Trova le coppie di animali!</p>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-3">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(index)}
              className={`
                aspect-square rounded-2xl flex items-center justify-center
                text-5xl cursor-pointer transform transition-all duration-300
                ${isFlipped(index) 
                  ? 'bg-white rotate-0 scale-100' 
                  : 'bg-pink-300 hover:bg-pink-200'
                }
                ${matched.includes(card.letter) ? 'opacity-50' : 'shadow-lg'}
              `}
            >
              {isFlipped(index) ? card.emoji : '❓'}
            </div>
          ))}
        </div>
        
        {showConfetti && (
          <div className="mt-8 text-center">
            <div className="text-4xl font-black text-white animate-pop">
              🎉 Fantastico!
            </div>
            <p className="text-white text-xl mt-2">
              Completato in {moves} mosse!
            </p>
            <Button onClick={initGame} color="green" className="mt-4">
              Gioca ancora
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// ✏️ GIOCO: SPELLING
// ============================================

function SpellingGame({ onBack, onScore }) {
  const { playSound } = useSound()
  const [word, setWord] = useState(null)
  const [guess, setGuess] = useState([])
  const [availableLetters, setAvailableLetters] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  
  const generateWord = useCallback(() => {
    const simpleAnimals = ANIMALS.filter(a => a.name.length <= 5)
    const animal = simpleAnimals[Math.floor(Math.random() * simpleAnimals.length)]
    const letters = animal.name.toUpperCase().split('')
    
    // Add some random letters
    const extraLetters = 'ABCDEFGHILMNOPRSTUVZ'.split('')
      .filter(l => !letters.includes(l))
      .slice(0, 3)
    
    setWord(animal)
    setGuess([])
    setAvailableLetters(shuffle([...letters, ...extraLetters]))
    setFeedback(null)
  }, [])
  
  useEffect(() => {
    generateWord()
  }, [generateWord])
  
  const handleLetterClick = (letter, index) => {
    playSound('click')
    setGuess(g => [...g, letter])
    setAvailableLetters(a => a.filter((_, i) => i !== index))
  }
  
  const handleRemoveLetter = (index) => {
    const letter = guess[index]
    setGuess(g => g.filter((_, i) => i !== index))
    setAvailableLetters(a => [...a, letter])
  }
  
  const checkWord = () => {
    const guessWord = guess.join('')
    const correctWord = word.name.toUpperCase()
    
    if (guessWord === correctWord) {
      playSound('correct')
      setFeedback('correct')
      setScore(s => s + 1)
      
      if (score + 1 >= 3) {
        setShowConfetti(true)
        onScore('spelling', score + 1)
        setTimeout(() => {
          setScore(0)
          setShowConfetti(false)
          generateWord()
        }, 2500)
      } else {
        setTimeout(generateWord, 2000)
      }
    } else {
      playSound('wrong')
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 1000)
    }
  }
  
  if (!word) return null
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-amber-500 p-6">
      {showConfetti && <Confetti />}
      
      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBack} color="gray" size="sm">← Menu</Button>
        <Stars count={score} />
        <div className="text-white font-bold text-xl">{score}/3</div>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-6 shadow-2xl text-center mb-6">
          <h2 className="text-lg font-bold text-gray-600 mb-2">
            Come si scrive?
          </h2>
          
          <div className="text-7xl mb-2 animate-bounce">
            {word.emoji}
          </div>
          
          <p className="text-gray-400 text-sm">
            Tocca le lettere per comporre la parola
          </p>
        </div>
        
        {/* Guess area */}
        <div className="bg-white rounded-2xl p-4 mb-6 min-h-[80px] flex items-center justify-center gap-2 flex-wrap">
          {guess.length === 0 ? (
            <span className="text-gray-300">Tocca le lettere...</span>
          ) : (
            guess.map((letter, i) => (
              <button
                key={i}
                onClick={() => handleRemoveLetter(i)}
                className="w-12 h-12 bg-yellow-100 rounded-xl text-2xl font-black text-yellow-600
                         flex items-center justify-center hover:bg-yellow-200 transition-all"
              >
                {letter}
              </button>
            ))
          )}
        </div>
        
        {/* Available letters */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {availableLetters.map((letter, i) => (
            <button
              key={i}
              onClick={() => handleLetterClick(letter, i)}
              className="w-14 h-14 bg-white rounded-xl text-2xl font-black text-gray-700
                       shadow-lg hover:scale-110 active:scale-95 transition-all"
            >
              {letter}
            </button>
          ))}
        </div>
        
        {/* Check button */}
        <Button 
          onClick={checkWord} 
          color="green" 
          size="lg" 
          className="w-full"
          disabled={guess.length === 0}
        >
          ✓ Controlla
        </Button>
        
        {feedback && (
          <div className={`
            mt-6 text-center text-3xl font-black
            ${feedback === 'correct' ? 'text-green-600' : 'text-red-500'}
            animate-pop
          `}>
            {feedback === 'correct' 
              ? `🎉 ${word.name}! Perfetto!` 
              : '😅 Riprova!'}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// 🎮 APP PRINCIPALE
// ============================================

export default function App() {
  const [currentGame, setCurrentGame] = useState(null)
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('kids-learning-progress')
    return saved ? JSON.parse(saved) : {
      numbers: 0,
      letters: 0,
      colors: 0,
      shapes: 0,
      memory: 0,
      spelling: 0,
    }
  })
  
  const handleScore = (game, points) => {
    setProgress(prev => {
      const updated = { ...prev, [game]: prev[game] + points }
      localStorage.setItem('kids-learning-progress', JSON.stringify(updated))
      return updated
    })
  }
  
  const handleBack = () => setCurrentGame(null)
  
  const renderGame = () => {
    switch (currentGame) {
      case 'numbers':
        return <NumbersGame onBack={handleBack} onScore={handleScore} />
      case 'letters':
        return <LettersGame onBack={handleBack} onScore={handleScore} />
      case 'colors':
        return <ColorsGame onBack={handleBack} onScore={handleScore} />
      case 'shapes':
        return <ShapesGame onBack={handleBack} onScore={handleScore} />
      case 'memory':
        return <MemoryGame onBack={handleBack} onScore={handleScore} />
      case 'spelling':
        return <SpellingGame onBack={handleBack} onScore={handleScore} />
      default:
        return <MainMenu onSelectGame={setCurrentGame} progress={progress} />
    }
  }
  
  return renderGame()
}
