// Quick Voice Test Script - Run in Browser Console (F12)

console.log('🎤 Testing Dante Voice Capabilities...');

// Test 1: Speech Recognition Support
if ('webkitSpeechRecognition' in window) {
  console.log('✅ Speech recognition supported');
} else {
  console.log('❌ Speech recognition not supported - try Chrome/Safari');
}

// Test 2: Microphone Access
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => {
    console.log('✅ Microphone access granted');
    
    // Test 3: Text-to-Speech
    const utterance = new SpeechSynthesisUtterance('Ubuntu means I am because we are - voice test successful!');
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
    console.log('🔊 Playing test audio...');
  })
  .catch(err => {
    console.log('❌ Microphone access denied:', err.message);
    console.log('💡 Click "Allow" when browser asks for microphone permission');
  });

// Test 4: Check for Voice Components
setTimeout(() => {
  const micButton = document.querySelector('button[class*="rounded-full"]');
  if (micButton && micButton.textContent.includes('🎤')) {
    console.log('✅ Microphone button found on page');
    console.log('👆 Click the 🎤 button and say "Hello Dante"');
  } else {
    console.log('⚠️  Microphone button not found - may be loading');
  }
}, 1000);

console.log('🎯 Voice test complete! Click the 🎤 button and start talking!');