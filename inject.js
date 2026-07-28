const fs = require('fs');
const dbPath = './.data/db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const code = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PromptDirector AI</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- Custom CSS for generic styling -->
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0f111a;
            color: #e2e8f0;
        }
        
        /* Custom scrollbar for textarea */
        textarea::-webkit-scrollbar {
            width: 8px;
        }
        textarea::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
        }
        textarea::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        /* Selection styling */
        ::selection {
            background-color: #6366f1; /* Indigo-500 */
            color: white;
        }
    </style>
</head>
<body class="selection:bg-indigo-500 selection:text-white pb-20">

    <!-- Navbar -->
    <nav class="border-b border-white/10 bg-[#0f111a]/80 backdrop-blur-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <i data-lucide="sparkles" class="w-5 h-5 text-white"></i>
                </div>
                <span class="font-bold text-lg tracking-tight text-white">PromptDirector <span class="text-indigo-400">AI</span></span>
            </div>
            <button 
                id="btnRandomize"
                class="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-medium transition-all border border-white/10"
            >
                <i data-lucide="zap" class="w-3 h-3 text-yellow-400"></i>
                Rastgele Üret
            </button>
        </div>
    </nav>

    <div class="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
        
        <!-- SOL PANEL: KONTROLLER -->
        <div class="lg:col-span-7 space-y-8">
            
            <!-- Bölüm 1: Karakter & Referans -->
            <section class="space-y-4">
                <div class="flex items-center justify-between">
                    <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <i data-lucide="user" class="w-4 h-4 text-indigo-400"></i> Karakter Profili
                    </h2>
                    <label id="lblFaceRef" class="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all border bg-indigo-500/20 border-indigo-500/50 text-indigo-300">
                        <input type="checkbox" id="inpUseFaceRef" checked class="hidden" />
                        <i data-lucide="scan-face" class="w-3 h-3"></i>
                        <span class="text-[10px] font-bold">Yüz Referansı Aktif</span>
                    </label>
                </div>
                
                <div class="bg-[#161925] border border-white/5 rounded-2xl p-1 shadow-xl">
                    <div class="grid grid-cols-2 gap-0.5">
                        <input type="text" id="inpSubject" value="Genç bir maceracı" placeholder="Kim? (Örn: Superman)" class="bg-[#1c202e] p-4 rounded-tl-xl outline-none text-sm placeholder-slate-600 focus:bg-[#232839] transition-colors" />
                        <input type="text" id="inpDetail" value="kısa saçlı, fit vücutlu" placeholder="Detay (Örn: Siyah pelerinli)" class="bg-[#1c202e] p-4 rounded-tr-xl outline-none text-sm placeholder-slate-600 focus:bg-[#232839] transition-colors" />
                        <input type="text" id="inpOutfit" value="" placeholder="Kıyafet (Örn: Zırh)" class="col-span-2 bg-[#1c202e] p-4 rounded-b-xl outline-none text-sm placeholder-slate-600 focus:bg-[#232839] transition-colors" />
                    </div>
                </div>
            </section>

            <!-- Bölüm 2: MEKAN İLİŞKİSİ -->
            <section class="space-y-4">
                <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <i data-lucide="box" class="w-4 h-4 text-emerald-400"></i> Konum & İlişki
                </h2>
                
                <div class="bg-[#161925] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                    <div class="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-xs text-slate-500 font-semibold ml-1">MEKAN İSMİ</label>
                            <div class="relative">
                                <i data-lucide="map-pin" class="absolute left-3 top-3 w-4 h-4 text-slate-500"></i>
                                <input 
                                    type="text" 
                                    id="inpLocation" 
                                    value="Eyfel Kulesi" 
                                    placeholder="Örn: Eyfel Kulesi" 
                                    class="w-full bg-[#1c202e] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-emerald-500/50 outline-none transition-all" 
                                />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-xs text-slate-500 font-semibold ml-1">KONUM İLİŞKİSİ</label>
                            <select 
                                id="inpSpatialRelation" 
                                class="w-full bg-[#1c202e] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-emerald-500/50 outline-none appearance-none cursor-pointer text-emerald-300 font-medium"
                            >
                                <option value="background" selected>Önünde (Mekan Arkada)</option>
                                <option value="on_top">Tepesinde / Üzerinde</option>
                                <option value="inside">İçinde (Kapalı Alan)</option>
                                <option value="sitting_on">Üzerine Oturmuş</option>
                                <option value="leaning">Yaslanmış (Duvarına vb.)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Akıllı İpucu (Gizli varsayılan) -->
                    <div id="hintOnTop" class="hidden mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-xs text-emerald-300 flex gap-2 items-start">
                        <i data-lucide="zap" class="w-4 h-4 mt-0.5 shrink-0"></i>
                        <span>
                            "Tepesinde" modu aktif. Yapay zekaya karakteri o binanın <strong>en tepesine (çatısına)</strong> koyması için özel komutlar eklendi.
                        </span>
                    </div>
                </div>
            </section>

            <!-- Bölüm 3: Kamera & Işık -->
            <section class="space-y-4">
                <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <i data-lucide="aperture" class="w-4 h-4 text-pink-400"></i> Kamera & Atmosfer
                </h2>
                
                <div class="grid grid-cols-3 gap-4" id="cameraButtonsContainer">
                    <!-- Kamera butonları JavaScript ile oluşturulacak -->
                </div>
                
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <input type="text" id="inpLighting" value="Altın Saat (Gün Batımı)" placeholder="Işık (Örn: Neon)" class="bg-[#1c202e] border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-500/30" />
                    <input type="text" id="inpPose" value="ufka bakıyor" placeholder="Poz (Örn: Kollar açık)" class="bg-[#1c202e] border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-500/30" />
                </div>
            </section>

        </div>

        <!-- SAĞ PANEL: ÇIKTI & PREVIEW -->
        <div class="lg:col-span-5 space-y-6 sticky top-24 h-fit">
            
            <div class="bg-gradient-to-b from-[#1c202e] to-[#161925] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                <!-- Header -->
                <div class="px-6 py-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span class="text-xs font-bold text-slate-400">CANLI PROMPT</span>
                    </div>
                    <select 
                        id="inpAspectRatio" 
                        class="bg-black/30 text-[10px] text-slate-300 border border-white/10 rounded px-2 py-1 outline-none"
                    >
                        <option value="--ar 16:9" selected>Sinematik (16:9)</option>
                        <option value="--ar 9:16">Hikaye/Reels (9:16)</option>
                        <option value="--ar 1:1">Kare (1:1)</option>
                    </select>
                </div>

                <!-- Prompt Display -->
                <div class="p-6">
                    <textarea 
                        id="txtFinalPrompt"
                        readonly 
                        class="w-full h-48 bg-transparent text-slate-300 text-sm font-mono leading-relaxed resize-none outline-none"
                    ></textarea>
                </div>

                <!-- Actions -->
                <div class="p-4 bg-black/20 border-t border-white/5">
                    <button 
                        id="btnCopy"
                        class="w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    >
                        <i id="iconCopy" data-lucide="copy" class="w-4 h-4"></i>
                        <span id="textCopy">PROMPTU KOPYALA</span>
                    </button>
                    
                    <div class="mt-4 flex gap-2 text-[10px] text-slate-500 justify-center">
                        <span>Desteklenen Modeller:</span>
                        <span class="text-slate-400">Midjourney v6</span>
                        <span class="text-slate-600">•</span>
                        <span class="text-slate-400">Flux.1</span>
                        <span class="text-slate-600">•</span>
                        <span class="text-slate-400">Stable Diffusion XL</span>
                    </div>
                </div>
            </div>
            
            <!-- Helper Info -->
            <div class="bg-[#161925]/50 rounded-xl p-4 border border-white/5 text-xs text-slate-500 leading-relaxed">
                <h3 class="text-slate-400 font-bold mb-1">Mekansal İlişki İpucu:</h3>
                Eğer karakterin Eyfel Kulesi, Gökdelen vb. yapıların <strong>üzerinde</strong> durmasını istiyorsanız, mutlaka "Tepesinde / Üzerinde" seçeneğini seçin. Bu seçenek, yapay zekaya karakterin ayaklarının zemine değil, o yapının çatısına basması gerektiğini söyleyen özel komutlar (Physical interaction with roof, summit) ekler.
            </div>

        </div>
    </div>

    <script>
        // Initialize Lucide Icons
        lucide.createIcons();

        // Data Pools
        const randomPool = {
            subjects: ['Cesur bir şehir kaşifi', 'Şık bir moda ikonu', 'Cyberpunk ajan', 'Sırt çantalı gezgin'],
            locations: ['Eyfel Kulesi', 'Burj Khalifa', 'Özgürlük Anıtı', 'Büyük Kanyon', 'Times Meydanı'],
            outfits: ['taktik ekipmanlar', 'kırmızı uçuşan elbise', 'siyah deri takım', 'beyaz kapüşonlu sweatshirt'],
        };

        const cameraOptions = [
            { id: 'Wide Angle', label: 'Geniş Açı' },
            { id: 'Drone Shot', label: 'Drone Çekimi' },
            { id: 'Selfie', label: 'Selfie' },
            { id: 'Close Up', label: 'Yakın Çekim (Portre)' },
            { id: 'Low Angle', label: 'Alt Açı (Aşağıdan)' },
            { id: 'GoPro', label: 'GoPro' }
        ];

        // State variables
        let state = {
            subject: 'Genç bir maceracı',
            detail: 'kısa saçlı, fit vücutlu',
            outfit: '',
            useFaceRef: true,
            location: 'Eyfel Kulesi',
            spatialRelation: 'background',
            cameraType: 'Wide Angle',
            lighting: 'Altın Saat (Gün Batımı)',
            pose: 'ufka bakıyor',
            aspectRatio: '--ar 16:9'
        };

        // DOM Elements
        const inpSubject = document.getElementById('inpSubject');
        const inpDetail = document.getElementById('inpDetail');
        const inpOutfit = document.getElementById('inpOutfit');
        const inpUseFaceRef = document.getElementById('inpUseFaceRef');
        const lblFaceRef = document.getElementById('lblFaceRef');
        
        const inpLocation = document.getElementById('inpLocation');
        const inpSpatialRelation = document.getElementById('inpSpatialRelation');
        const hintOnTop = document.getElementById('hintOnTop');
        
        const cameraButtonsContainer = document.getElementById('cameraButtonsContainer');
        const inpLighting = document.getElementById('inpLighting');
        const inpPose = document.getElementById('inpPose');
        const inpAspectRatio = document.getElementById('inpAspectRatio');
        
        const txtFinalPrompt = document.getElementById('txtFinalPrompt');
        const btnRandomize = document.getElementById('btnRandomize');
        const btnCopy = document.getElementById('btnCopy');
        const iconCopy = document.getElementById('iconCopy');
        const textCopy = document.getElementById('textCopy');

        // Render Camera Buttons
        function renderCameraButtons() {
            cameraButtonsContainer.innerHTML = '';
            cameraOptions.forEach(cam => {
                const btn = document.createElement('button');
                btn.className = \`px-3 py-3 rounded-xl text-xs font-medium border transition-all \${
                    state.cameraType === cam.id 
                        ? 'bg-pink-500/20 border-pink-500/50 text-pink-300' 
                        : 'bg-[#161925] border-white/5 text-slate-500 hover:bg-white/5'
                }\`;
                btn.innerText = cam.label;
                btn.onclick = () => {
                    state.cameraType = cam.id;
                    updateUI();
                };
                cameraButtonsContainer.appendChild(btn);
            });
        }

        // Generate Prompt Logic
        function generatePrompt() {
            const character = \`\${state.subject}, \${state.detail}\`;
            const outfit = state.outfit ? \`wearing \${state.outfit}\` : 'wearing trendy clothing';
            
            let spatialPrompt = "";
            let cameraPrompt = state.cameraType;

            const loc = state.location || "a landmark";

            switch (state.spatialRelation) {
                case 'on_top':
                    spatialPrompt = \`standing on the very top summit of \${loc}, high altitude, dangerous height, physical interaction with the roof\`;
                    if (!cameraPrompt.includes('Drone') && !cameraPrompt.includes('Selfie')) {
                        cameraPrompt += ", Aerial Drone Shot";
                    }
                    break;
                case 'inside':
                    spatialPrompt = \`inside the interior of \${loc}, indoor environment\`;
                    break;
                case 'sitting_on':
                    spatialPrompt = \`sitting directly on the surface of \${loc}, physical contact\`;
                    break;
                case 'leaning':
                    spatialPrompt = \`leaning against the wall of \${loc}\`;
                    break;
                case 'in_front':
                    spatialPrompt = \`standing in front of \${loc}, \${loc} in background\`;
                    break;
                default:
                    spatialPrompt = \`located at \${loc}, \${loc} visible in background\`;
            }

            const lighting = state.lighting || "cinematic lighting";
            const quality = "Masterpiece, 8k, hyperrealistic, sharp focus, ray tracing, depth of field";

            const rawPrompt = \`\${cameraPrompt} photo of \${character}, \${spatialPrompt}, \${state.pose}. \${outfit}. \${lighting}. \${quality} \${state.aspectRatio}\`;
            
            // Clean up extra spaces
            return rawPrompt.trim().replace(/\s+/g, ' ');
        }

        // Update UI based on state
        function updateUI() {
            inpSubject.value = state.subject;
            inpDetail.value = state.detail;
            inpOutfit.value = state.outfit;
            inpUseFaceRef.checked = state.useFaceRef;
            
            // Toggle face ref style
            if(state.useFaceRef) {
                lblFaceRef.className = "flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all border bg-indigo-500/20 border-indigo-500/50 text-indigo-300";
            } else {
                lblFaceRef.className = "flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all border bg-white/5 border-white/10 text-slate-500";
            }

            inpLocation.value = state.location;
            inpSpatialRelation.value = state.spatialRelation;
            
            // Toggle hint
            if(state.spatialRelation === 'on_top') {
                hintOnTop.classList.remove('hidden');
            } else {
                hintOnTop.classList.add('hidden');
            }

            inpLighting.value = state.lighting;
            inpPose.value = state.pose;
            inpAspectRatio.value = state.aspectRatio;

            renderCameraButtons();
            
            txtFinalPrompt.value = generatePrompt();
        }

        // Event Listeners for inputs
        inpSubject.addEventListener('input', (e) => { state.subject = e.target.value; updateUI(); });
        inpDetail.addEventListener('input', (e) => { state.detail = e.target.value; updateUI(); });
        inpOutfit.addEventListener('input', (e) => { state.outfit = e.target.value; updateUI(); });
        inpUseFaceRef.addEventListener('change', (e) => { state.useFaceRef = e.target.checked; updateUI(); });
        
        inpLocation.addEventListener('input', (e) => { state.location = e.target.value; updateUI(); });
        inpSpatialRelation.addEventListener('change', (e) => { state.spatialRelation = e.target.value; updateUI(); });
        
        inpLighting.addEventListener('input', (e) => { state.lighting = e.target.value; updateUI(); });
        inpPose.addEventListener('input', (e) => { state.pose = e.target.value; updateUI(); });
        inpAspectRatio.addEventListener('change', (e) => { state.aspectRatio = e.target.value; updateUI(); });

        // Randomize Function
        btnRandomize.addEventListener('click', () => {
            state.subject = randomPool.subjects[Math.floor(Math.random() * randomPool.subjects.length)];
            state.location = randomPool.locations[Math.floor(Math.random() * randomPool.locations.length)];
            state.outfit = randomPool.outfits[Math.floor(Math.random() * randomPool.outfits.length)];
            state.spatialRelation = 'on_top';
            state.cameraType = 'Drone Shot';
            updateUI();
        });

        // Copy Function
        btnCopy.addEventListener('click', () => {
            const textArea = document.createElement("textarea");
            textArea.value = txtFinalPrompt.value;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    // Update Button UI
                    btnCopy.className = "w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20";
                    textCopy.innerText = "KOPYALANDI";
                    iconCopy.setAttribute('data-lucide', 'check');
                    lucide.createIcons(); // Re-render icons to show checkmark
                    
                    setTimeout(() => {
                        btnCopy.className = "w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20";
                        textCopy.innerText = "PROMPTU KOPYALA";
                        iconCopy.setAttribute('data-lucide', 'copy');
                        lucide.createIcons();
                    }, 2000);
                }
            } catch (err) {
                console.error('Kopyalama hatası:', err);
            }
            
            document.body.removeChild(textArea);
        });

        // Initial Render
        updateUI();

    </script>
</body>
</html>`;

db.workshops = db.workshops.filter(w => w.title !== 'PromptDirector AI'); // Remove existing if any
db.workshops.unshift({
  id: `wks_${Date.now()}`,
  title: 'PromptDirector AI',
  slug: 'promptdirector-ai',
  description: 'AI Destekli Akıllı Prompt Oluşturucu',
  category: 'YouTube Kanalı',
  difficulty: 'İleri',
  estimated_hours: 1,
  repo_url: '',
  code_content: code,
  code_language: 'html',
  file_attachments: [],
  tags: ['ai', 'prompt', 'midjourney'],
  cover_image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
  created_at: new Date().toISOString()
});
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Successfully injected Workshop into database.');
