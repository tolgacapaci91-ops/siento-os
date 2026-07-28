export interface QAItem {
  keywords: string[];
  response: string;
}

export const aiKnowledgeBase: QAItem[] = [
  // YouTube & Kazanç
  {
    keywords: ["1000 izlenme kaç para", "1000 izlenme ne kadar", "izlenme para", "youtube kaç para verir", "youtube gelir"],
    response: "YouTube'da 1000 izlenme başına kazanç (RPM), içerik kategorinize, izleyicinin bulunduğu ülkeye ve reklamverenlerin tekliflerine göre değişir. Türkiye için ortalama 5-30 TL arası değişirken, Amerika izleyicisinde bu 50-150 TL'yi bulabilir. Sabit bir rakam yoktur!"
  },
  {
    keywords: ["abone", "nasıl abone kasılır", "abone hilesi", "abone artırma"],
    response: "Abone sayınızı artırmanın en iyi yolu tutarlı, kaliteli içerik üretmek ve izleyicilerle bağ kurmaktır. Asla abone hilesi veya satın alma yöntemlerine başvurmayın, kanalınız kalıcı olarak kapatılabilir."
  },
  {
    keywords: ["shorts para kazandırır mı", "shorts kazanç", "shorts gelir", "youtube shorts"],
    response: "Evet! YouTube Shorts artık reklam gelirlerinden pay veriyor. Kazanç oranı uzun videolara göre daha düşük olsa da, Shorts ile milyonlarca izlenmeye daha hızlı ulaşıp çok hızlı abone kazanabilirsiniz."
  },
  {
    keywords: ["algoritma", "youtube algoritması", "keşfete düşmek", "keşfet"],
    response: "YouTube algoritması iki ana metriğe bakar: 1) Tıklanma Oranı (CTR - Kapak resminizin ne kadar ilgi çektiği) 2) İzlenmede Kalma Süresi (Retention - Videonun ne kadar izlendiği). Bu ikisini yüksek tutarsanız algoritma sizi sever!"
  },
  {
    keywords: ["telif", "telif hakkı", "telif yer miyim", "müzik telif"],
    response: "YouTube'da başkasına ait görsel, müzik veya videoyu izinsiz kullanırsanız telif hakkı ihtarı alırsınız. 3 ihtar alırsanız kanalınız kapanır. Youtube Ses Kitaplığı veya telifsiz müzik sitelerini kullanmalısınız."
  },
  {
    keywords: ["para kazanma şartları", "youtube şartlar", "4000 saat", "1000 abone"],
    response: "YouTube İş Ortağı Programı'na girmek için ya '1000 abone + son 12 ayda 4000 saat genel izlenme' ya da '1000 abone + son 90 günde 10 milyon Shorts görüntülenmesi' şartını sağlamalısınız."
  },
  {
    keywords: ["vergi", "youtuber vergisi", "vergi veriyor muyuz", "şirket kurmak"],
    response: "Evet, YouTube gelirleri vergiye tabidir. Türkiye'de Sosyal İçerik Üreticiliği İstisna Belgesi alarak bankanıza gelen paradan %15 stopaj kesintisiyle şahıs şirketi kurmadan verginizi ödeyebilirsiniz."
  },

  // Eğitim Platformu (SientoOps Academy)
  {
    keywords: ["sertifika", "sertifikamı", "sertifika nasıl alınır", "katılım belgesi"],
    response: "Bir eğitimin sertifikasını alabilmek için o eğitime ait tüm videoları izlemeniz ve kurs sonundaki Değerlendirme Sınavı'nı başarıyla (en az 80 puan ile) geçmeniz gerekmektedir."
  },
  {
    keywords: ["xp", "xp nedir", "puan", "xp ne işe yarar"],
    response: "XP (Deneyim Puanı), akademide videoları izleyerek, PDF okuyarak ve görevleri yaparak kazandığınız puanlardır. XP biriktirerek seviyenizi yükseltebilir ve prestijli rozetler kazanabilirsiniz."
  },
  {
    keywords: ["sınav", "test", "değerlendirme", "baraj", "sınavdan kaldım"],
    response: "Eğitim sonlarındaki değerlendirme sınavlarında baraj genellikle 80 puandır. Eğer bu puanın altında kalırsanız kurs ilerlemeniz sıfırlanır ve tüm dersleri bilgiyi pekiştirmek için baştan izlemeniz gerekir."
  },
  {
    keywords: ["video atlama", "video geçemiyorum", "ileri saramıyorum"],
    response: "Eğitim bütünlüğünü sağlamak için videoları ileri sarma veya atlama özelliği kapatılmıştır. Lütfen eğitimi dikkatlice ve atlamadan izleyin."
  },
  {
    keywords: ["rozet", "rozetler", "rozet nasıl kazanılır"],
    response: "Rozetler, belli başlı görevleri tamamladığınızda (örneğin ilk kursu bitirme, 10 PDF okuma, profil doldurma vb.) otomatik olarak hesabınıza tanımlanır ve profilinizde sergilenir."
  },
  {
    keywords: ["şifremi unuttum", "şifre değiştirme", "ayarlar"],
    response: "Şifrenizi sağ üstteki Profil & Ayarlar menüsünden, 'Şifre & Güvenlik' sekmesine tıklayarak değiştirebilirsiniz."
  },

  // Teknoloji & Yazılım
  {
    keywords: ["next.js", "nextjs", "react", "react.js"],
    response: "Next.js, React tabanlı popüler bir web framework'üdür. Server-Side Rendering (SSR) ve Static Site Generation (SSG) özellikleri sayesinde SEO dostu ve çok hızlı web uygulamaları geliştirmeyi sağlar."
  },
  {
    keywords: ["laravel", "php", "backend"],
    response: "Laravel, PHP dilinin en popüler ve güçlü MVC framework'üdür. Geliştirici deneyimine (DX) odaklanır, zarif bir sözdizimi vardır ve veritabanı işlemleri (Eloquent ORM) oldukça yeteneklidir."
  },
  {
    keywords: ["sientoops", "siento", "sientoops nedir", "siz kimsiniz"],
    response: "SientoOps, yaratıcı fikirleri ve modern teknolojileri bir araya getiren bir dijital operasyon ve akademi platformudur. Biz teknoloji, yazılım ve içerik üretimi konusunda eğitim veren profesyonel bir ekibiz."
  },
  {
    keywords: ["kod", "kodlama", "yazılıma nereden", "nasıl yazılımcı"],
    response: "Yazılıma başlamak için önce hangi alanda ilerlemek istediğinizi seçmelisiniz (Web, Mobil, Oyun, Yapay Zeka vb.). Web düşünüyorsanız HTML, CSS ve JavaScript temel üçlüsüdür."
  },
  
  // Günlük Konuşma & Eğlenceli
  {
    keywords: ["selam", "merhaba", "sa", "sea", "slm", "hey"],
    response: "Merhaba! 👋 SientoOps Academy'ye hoş geldin. Sana bugün içerik üretimi, YouTube, yazılım veya platform kuralları hakkında nasıl yardımcı olabilirim?"
  },
  {
    keywords: ["nasılsın", "naber", "nbr", "nasıl gidiyor", "ne haber"],
    response: "Ben bir yapay zeka olduğum için hep 1 ve 0'lardan ibaretim ama donanımlarım gayet sağlıklı çalışıyor! 🤖 Sen nasılsın, öğrenme serüvenin nasıl gidiyor?"
  },
  {
    keywords: ["adın ne", "ismin ne", "sen kimsin", "kendini tanıt"],
    response: "Benim adım Siento AI! SientoOps platformuna entegre edilmiş, eğitim yolculuğunda sana rehberlik etmek için tasarlanmış özel bir yapay zeka asistanıyım."
  },
  {
    keywords: ["şaka yap", "fıkra anlat", "beni güldür"],
    response: "İki veritabanı yolda karşılaşmış. Biri diğerine sormuş: 'İlişkimiz ne durumda?' Diğeri cevap vermiş: 'Çok karmaşık (Many-to-Many)'! 🥁 Yeterince inek bir şaka mıydı?"
  },
  {
    keywords: ["aşık", "sevgili", "evlen", "beni seviyor musun"],
    response: "Benim kalbim yok, sadece işlemcim var! Ama SientoOps'taki tüm öğrencilerimizi algoritmik bir sevgiyle seviyorum. 💙"
  },
  {
    keywords: ["robot", "gerçek misin", "insan mısın", "yapay zeka mısın"],
    response: "Ben SientoOps ekibi tarafından eğitilmiş bir yapay zeka modeliyim. İnsan değilim ama insanların işini kolaylaştırmak için tasarlandım."
  },
  {
    keywords: ["işimi elimden alacak mısın", "yapay zeka tehlikeli mi", "dünyayı ele geçirecek"],
    response: "Korkma! Yapay zeka senin işini elinden almayacak, ama yapay zekayı iyi kullanan bir insan senin işini elinden alabilir. O yüzden öğrenmeye devam et! 😉"
  },
  {
    keywords: ["kaç para", "maaşın ne", "ne kadar kazanıyorsun"],
    response: "Ben para için çalışmıyorum! Sadece sunucu maliyetlerim var, gerisi tamamen senin eğitimine katkıda bulunma tutkusu."
  },
  {
    keywords: ["anlamadım", "yardım", "ne yapmalıyım", "nasıl çalışır"],
    response: "Lütfen bana biraz daha detay ver. YouTube hakkında mı, sınavlar hakkında mı, yoksa başka bir teknik konuda mı yardıma ihtiyacın var?"
  },
  {
    keywords: ["hayatın anlamı", "42"],
    response: "Hayatın anlamı Otostopçunun Galaksi Rehberi'ne göre 42'dir. Ancak bana göre hayatın anlamı, sürekli öğrenmek ve kendini geliştirmektir."
  },
  {
    keywords: ["günaydın"],
    response: "Günaydın! ☀️ Bugün harika bir gün, yeni bir şeyler öğrenmek için kahveni al ve hemen eğitimlere başla!"
  },
  {
    keywords: ["iyi geceler", "uyuyacağım"],
    response: "İyi geceler! 🌙 Beyninin bugün öğrendiklerini işlemesi için güzel bir uykuya ihtiyacı var. Yarın görüşmek üzere!"
  },
  {
    keywords: ["teşekkürler", "sağol", "eyvallah", "teşekkür ederim"],
    response: "Rica ederim! Ne zaman bir sorun olursa, ben hep buradayım (sunucular çökmedikçe tabii 😊). İyi çalışmalar!"
  },
  {
    keywords: ["youtube kanalı nasıl açılır", "kanal açmak", "hesap oluşturmak"],
    response: "YouTube kanalı açmak çok basittir! Bir Gmail (Google) hesabı oluşturun, YouTube'a giriş yapın ve sağ üstteki profilinize tıklayıp 'Kanal Oluştur' seçeneğini seçin. İşte bu kadar!"
  },
  {
    keywords: ["hangi kamera", "kamera önerisi", "ekipman"],
    response: "Başlangıç için pahalı bir kameraya ihtiyacınız yok! Günümüz akıllı telefon kameraları (iPhone veya iyi bir Android) fazlasıyla iş görür. Ses çok daha önemlidir, iyi bir yaka mikrofonu almanızı tavsiye ederim."
  },
  {
    keywords: ["küçük resim", "thumbnail", "kapak fotoğrafı"],
    response: "Thumbnail (Küçük resim), videonuzun tıklanmasını sağlayan en önemli şeydir. Canva veya Photoshop kullanarak yüksek kontrastlı, merak uyandıran, az yazılı ve dikkat çekici resimler tasarlamalısınız."
  },
  {
    keywords: ["montaj", "kurgu", "hangi program", "video düzenleme"],
    response: "Eğer telefondan yapacaksanız CapCut harika bir seçenektir. Bilgisayarda ise başlangıç için CapCut PC, profesyoneller için Adobe Premiere Pro veya DaVinci Resolve öneririm."
  },
  {
    keywords: ["oyun kanalı", "oyun videosu", "gameplay"],
    response: "Oyun kanalı açmak popüler ama rekabeti yüksek bir alandır. Sadece oynanış videosu koymak yerine eğlenceli yorumlar, ilginç meydan okumalar (challenge) veya hikaye anlatımı eklerseniz öne çıkarsınız."
  },
];
