import { EducationLevel, GradeLevel } from '../types';

export const EDUCATION_LEVELS = [
    { id: 'primary', label: 'İlkokul' },
    { id: 'secondary', label: 'Ortaokul' },
    { id: 'high', label: 'Lise' },
] as const;

export const GRADES = {
    primary: [
        { id: '1', label: '1. Sınıf' },
        { id: '2', label: '2. Sınıf' },
        { id: '3', label: '3. Sınıf' },
        { id: '4', label: '4. Sınıf' },
    ],
    secondary: [
        { id: '5', label: '5. Sınıf' },
        { id: '6', label: '6. Sınıf' },
        { id: '7', label: '7. Sınıf' },
        { id: '8', label: '8. Sınıf' },
    ],
    high: [
        { id: '9', label: '9. Sınıf' },
        { id: '10', label: '10. Sınıf' },
        { id: '11', label: '11. Sınıf' },
        { id: '12', label: '12. Sınıf' },
    ],
};

export const GRADE_SUBJECTS: Record<GradeLevel, { subject: string; topics: string[] }[]> = {
    '1': [
        { subject: 'Türkçe', topics: ['Okuma', 'Yazma', 'Temel Dil Bilgisi'] },
        { subject: 'Matematik', topics: ['Sayılar', 'Temel İşlemler', 'Geometri'] },
        { subject: 'Hayat Bilgisi', topics: ['Okulumuz', 'Ailemiz', 'Doğa'] },
        { subject: 'İngilizce', topics: ['Temel Kelimeler', 'Selamlaşma'] }
    ],
    '2': [
        { subject: 'Türkçe', topics: ['Okuma', 'Yazma', 'Dil Bilgisi', 'Sözcük Bilgisi'] },
        { subject: 'Matematik', topics: ['Sayılar', 'İşlemler', 'Geometri', 'Ölçme'] },
        { subject: 'Hayat Bilgisi', topics: ['Doğa ve Çevre', 'Toplum Hayatı', 'Sağlık ve Güvenlik'] },
        { subject: 'İngilizce', topics: ['Temel Kelimeler', 'Basit Cümleler', 'Günlük Konuşma'] }
    ],
    '3': [
        { subject: 'Türkçe', topics: ['Okuma', 'Yazma', 'Dil Bilgisi', 'Sözcük Bilgisi', 'Metin Türleri'] },
        { subject: 'Matematik', topics: ['Sayılar', 'İşlemler', 'Geometri', 'Ölçme', 'Kesirler'] },
        { subject: 'Hayat Bilgisi', topics: ['Doğa ve Çevre', 'Toplum Hayatı', 'Sağlık ve Güvenlik', 'Teknoloji'] },
        { subject: 'İngilizce', topics: ['Temel Kelimeler', 'Basit Cümleler', 'Günlük Konuşma', 'Zamanlar'] }
    ],
    '4': [
        { subject: 'Türkçe', topics: ['Okuma', 'Yazma', 'Dil Bilgisi', 'Sözcük Bilgisi', 'Metin Türleri', 'Yazım Kuralları'] },
        { subject: 'Matematik', topics: ['Sayılar', 'İşlemler', 'Geometri', 'Ölçme', 'Kesirler', 'Ondalık Sayılar'] },
        { subject: 'Hayat Bilgisi', topics: ['Doğa ve Çevre', 'Toplum Hayatı', 'Sağlık ve Güvenlik', 'Teknoloji', 'Tarih'] },
        { subject: 'İngilizce', topics: ['Temel Kelimeler', 'Basit Cümleler', 'Günlük Konuşma', 'Zamanlar', 'Dilbilgisi'] }
    ],
    '5': [
        { subject: 'Türkçe', topics: ['Sözcükte Anlam', 'Cümlede Anlam', 'Paragrafta Anlam', 'Dil Bilgisi'] },
        { subject: 'Matematik', topics: ['Doğal Sayılar', 'Kesirler', 'Geometri', 'Veri Analizi'] },
        { subject: 'Fen Bilimleri', topics: ['Güneş, Dünya ve Ay', 'Canlılar Dünyası', 'Kuvvetin Ölçülmesi'] },
        { subject: 'Sosyal Bilgiler', topics: ['Birey ve Toplum', 'Kültür ve Miras', 'İnsanlar, Yerler ve Çevreler'] },
        { subject: 'İngilizce', topics: ['Hello', 'My Town', 'Games and Hobbies', 'My Daily Routine'] }
    ],
    '6': [
        { subject: 'Türkçe', topics: ['Sözcükte Anlam', 'Cümlede Anlam', 'Paragrafta Anlam', 'Dil Bilgisi', 'Yazım Kuralları'] },
        { subject: 'Matematik', topics: ['Sayılar', 'Cebir', 'Geometri', 'Veri Analizi', 'Olasılık'] },
        { subject: 'Fen Bilimleri', topics: ['Güneş Sistemi', 'Vücudumuzdaki Sistemler', 'Kuvvet ve Hareket'] },
        { subject: 'Sosyal Bilgiler', topics: ['Birey ve Toplum', 'Kültür ve Miras', 'İnsanlar, Yerler ve Çevreler', 'Bilim, Teknoloji ve Toplum'] },
        { subject: 'İngilizce', topics: ['Life', 'Yummy Breakfast', 'Downtown', 'Weather and Emotions'] }
    ],
    '7': [
        { subject: 'Türkçe', topics: ['Sözcükte Anlam', 'Cümlede Anlam', 'Paragrafta Anlam', 'Dil Bilgisi', 'Yazım Kuralları'] },
        { subject: 'Matematik', topics: ['Tam Sayılar', 'Rasyonel Sayılar', 'Cebirsel İfadeler', 'Eşitlik ve Denklem'] },
        { subject: 'Fen Bilimleri', topics: ['Güneş Sistemi ve Ötesi', 'Hücre ve Bölünmeler', 'Kuvvet ve Enerji'] },
        { subject: 'Sosyal Bilgiler', topics: ['İletişim ve İnsan İlişkileri', 'Ülkemizde Nüfus', 'Türk Tarihinde Yolculuk'] },
        { subject: 'İngilizce', topics: ['Appearance and Personality', 'Sports', 'Biographies', 'Wild Animals'] }
    ],
    '8': [
        { subject: 'Türkçe', topics: ['Sözcükte Anlam', 'Cümlede Anlam', 'Paragrafta Anlam', 'Dil Bilgisi', 'Yazım Kuralları'] },
        { subject: 'Matematik', topics: ['Çarpanlar ve Katlar', 'Üslü İfadeler', 'Kareköklü İfadeler', 'Veri Analizi'] },
        { subject: 'Fen Bilimleri', topics: ['Mevsimler ve İklim', 'DNA ve Genetik Kod', 'Basınç', 'Madde ve Endüstri'] },
        { subject: 'Sosyal Bilgiler', topics: ['Bir Kahraman Doğuyor', 'Milli Uyanış', 'Ya İstiklal Ya Ölüm'] },
        { subject: 'İngilizce', topics: ['Friendship', 'Teen Life', 'In the Kitchen', 'On the Phone'] }
    ],
    '9': [
        { subject: 'Türkçe', topics: ['Sözcükte Anlam', 'Cümlede Anlam', 'Paragrafta Anlam', 'Dil Bilgisi', 'Edebiyat'] },
        { subject: 'Matematik', topics: ['Mantık', 'Kümeler', 'Denklemler ve Eşitsizlikler', 'Üçgenler'] },
        { subject: 'Fizik', topics: ['Fizik Bilimine Giriş', 'Madde ve Özellikleri', 'Hareket ve Kuvvet', 'Enerji'] },
        { subject: 'Kimya', topics: ['Kimya Bilimi', 'Atom ve Periyodik Sistem', 'Kimyasal Bağlar'] },
        { subject: 'Biyoloji', topics: ['Yaşam Bilimi Biyoloji', 'Hücre', 'Canlılar Dünyası'] },
        { subject: 'Tarih', topics: ['Tarih ve Zaman', 'İnsanlığın İlk Dönemleri', 'Orta Çağda Dünya'] },
        { subject: 'Coğrafya', topics: ['Doğa ve İnsan', 'Dünya\'nın Şekli ve Hareketleri', 'Harita Bilgisi'] },
        { subject: 'Felsefe', topics: ['Felsefeye Giriş', 'Bilgi Felsefesi', 'Varlık Felsefesi'] }
    ],
    '10': [
        { subject: 'Türkçe', topics: ['Sözcükte Anlam', 'Cümlede Anlam', 'Paragrafta Anlam', 'Dil Bilgisi', 'Edebiyat'] },
        { subject: 'Matematik', topics: ['Sayılar', 'Polinomlar', 'İkinci Dereceden Denklemler', 'Trigonometri'] },
        { subject: 'Fizik', topics: ['Elektrik ve Manyetizma', 'Dalgalar', 'Optik'] },
        { subject: 'Kimya', topics: ['Kimyasal Tepkimeler', 'Karışımlar', 'Asitler, Bazlar ve Tuzlar'] },
        { subject: 'Biyoloji', topics: ['Hücre Bölünmeleri', 'Kalıtım', 'Ekosistem Ekolojisi'] },
        { subject: 'Tarih', topics: ['Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi', 'Beylikten Devlete Osmanlı'] },
        { subject: 'Coğrafya', topics: ['Nüfus', 'Göç', 'Yerleşme'] },
        { subject: 'Felsefe', topics: ['Ahlak Felsefesi', 'Sanat Felsefesi', 'Din Felsefesi'] }
    ],
    '11': [
        { subject: 'Türkçe', topics: ['Sözcükte Anlam', 'Cümlede Anlam', 'Paragrafta Anlam', 'Dil Bilgisi', 'Edebiyat'] },
        { subject: 'Matematik', topics: ['Trigonometri', 'Analitik Geometri', 'Fonksiyonlar', 'Limit ve Süreklilik'] },
        { subject: 'Fizik', topics: ['Kuvvet ve Hareket', 'Elektrik', 'Manyetizma'] },
        { subject: 'Kimya', topics: ['Modern Atom Teorisi', 'Gazlar', 'Sıvı Çözeltiler'] },
        { subject: 'Biyoloji', topics: ['İnsan Fizyolojisi', 'Komünite ve Popülasyon Ekolojisi'] },
        { subject: 'Tarih', topics: ['Değişen Dünya Dengeleri Karşısında Osmanlı Siyaseti', 'Değişim Çağında Avrupa ve Osmanlı'] },
        { subject: 'Coğrafya', topics: ['Doğal Sistemler', 'Beşeri Sistemler', 'Küresel Ortam'] },
        { subject: 'Felsefe', topics: ['Bilgi Felsefesi', 'Varlık Felsefesi', 'Ahlak Felsefesi'] }
    ],
    '12': [
        { subject: 'Türkçe', topics: ['Sözcükte Anlam', 'Cümlede Anlam', 'Paragrafta Anlam', 'Dil Bilgisi', 'Edebiyat'] },
        { subject: 'Matematik', topics: ['Türev', 'İntegral', 'Analitik Geometri', 'Uzay Geometri'] },
        { subject: 'Fizik', topics: ['Çembersel Hareket', 'Basit Harmonik Hareket', 'Dalga Mekaniği'] },
        { subject: 'Kimya', topics: ['Organik Kimya', 'Enerji Kaynakları', 'Kimya Her Yerde'] },
        { subject: 'Biyoloji', topics: ['Genden Proteine', 'Canlılarda Enerji Dönüşümleri', 'Bitki Biyolojisi'] },
        { subject: 'Tarih', topics: ['20. Yüzyıl Başlarında Osmanlı Devleti', 'Milli Mücadele'] },
        { subject: 'Coğrafya', topics: ['Çevre ve Toplum', 'Küresel Ortam', 'Bölgeler ve Ülkeler'] },
        { subject: 'Felsefe', topics: ['Bilim Felsefesi', 'Sanat Felsefesi', 'Din Felsefesi'] }
    ]
}; 