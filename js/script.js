document.addEventListener('DOMContentLoaded', function() {
    
    // =======================================================
    // LOGIKA UNTUK SEMUA HALAMAN (SHARED LOGIC)
    // =======================================================
    
    // Fungsi Logout yang bisa digunakan di semua halaman setelah login
    const logoutButton = document.getElementById('logoutButton');
    if(logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('loggedInUserName'); // Hapus data pengguna dari localStorage
            window.location.href = 'index.html'; // Kembali ke halaman login
        });
    }

// =======================================================
// LOGIKA UNTUK HALAMAN LOGIN (index.html)
// =======================================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    // --- 1. Logika untuk submit form ---
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const user = dataPengguna.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('loggedInUserName', user.nama);
            window.location.href = 'dashboard.html';
        } else {
            alert('Email atau password yang Anda masukkan salah!');
        }
    });

    // --- 2. Logika untuk membuka semua modal ---
    // Definisikan semua link dan modal yang akan dibuka
    const modalTriggers = [
        { linkId: 'forgotPasswordLink', modalId: 'forgotPasswordModal' },
        { linkId: 'ecampusLink', modalId: 'ecampusModal' },
        { linkId: 'aboutLink', modalId: 'aboutModal' }
    ];

    modalTriggers.forEach(trigger => {
        const link = document.getElementById(trigger.linkId);
        const modal = document.getElementById(trigger.modalId);
        if (link && modal) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                modal.style.display = 'block';
            });
        }
    });

    // --- 3. Logika global untuk MENUTUP semua modal ---
    // Menutup dengan tombol 'x'
    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Cari parent terdekat yang merupakan '.modal' dan sembunyikan
            button.closest('.modal').style.display = 'none';
        });
    });

    // Menutup dengan klik di luar area modal
    window.addEventListener('click', function(event) {
        // Jika elemen yang diklik memiliki class 'modal'
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}
    // =======================================================
    // LOGIKA UNTUK HALAMAN DASHBOARD (dashboard.html)
    // =======================================================
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        // 1. Tampilkan nama pengguna dari localStorage
        const userName = localStorage.getItem('loggedInUserName');
        if (userName) {
            document.getElementById('userName').textContent = userName;
        } else {
            // Jika tidak ada user login, kembalikan ke halaman login
            window.location.href = 'index.html';
        }

        // 2. Tampilkan sapaan berdasarkan waktu
        const now = new Date();
        const hour = now.getHours();
        let greetingText = '';

        if (hour < 12) {
            greetingText = 'Selamat Pagi';
        } else if (hour < 18) {
            greetingText = 'Selamat Siang';
        } else {
            greetingText = 'Selamat Malam';
        }
        greetingElement.textContent = greetingText;
    }

    // =======================================================
    // LOGIKA UNTUK HALAMAN TRACKING (tracking.html)
    // =======================================================
    const trackingForm = document.getElementById('trackingForm');
    if (trackingForm) {
        trackingForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah form reload halaman

            const doNumber = document.getElementById('doNumber').value;
            const resultContainer = document.getElementById('trackingResult');

            // Cari data di objek dataTracking menggunakan nomor DO sebagai key
            const trackingData = dataTracking[doNumber];

            if (trackingData) {
                // Jika data ditemukan, buat HTML untuk menampilkannya
                let perjalananHtml = '';
                trackingData.perjalanan.forEach(item => {
                    perjalananHtml += `
                        <li class="timeline-item">
                            <span class="timeline-time">${item.waktu}</span>
                            <span class="timeline-description">${item.keterangan}</span>
                        </li>
                    `;
                });

                resultContainer.innerHTML = `
                    <div class="result-header">
                        <h3>Nomor DO: ${trackingData.nomorDO}</h3>
                        <p>Nama Mahasiswa: ${trackingData.nama}</p>
                    </div>
                    <h4>Detail Pengiriman</h4>
                    <p><strong>Status:</strong> ${trackingData.status}</p>
                    <p><strong>Ekspedisi:</strong> ${trackingData.ekspedisi}</p>
                    <p><strong>Tanggal Kirim:</strong> ${trackingData.tanggalKirim}</p>
                    <p><strong>Total Pembayaran:</strong> ${trackingData.total}</p>

                    <h4>Perjalanan Paket</h4>
                    <ul class="timeline">
                        ${perjalananHtml}
                    </ul>
                `;
            } else {
                // Jika data tidak ditemukan, tampilkan pesan error
                alert('Nomor Delivery Order tidak ditemukan!');
                resultContainer.innerHTML = '<p>Silakan masukkan nomor DO yang valid dan klik "Cari".</p>';
            }
        });
    }

    // =======================================================
    // LOGIKA UNTUK HALAMAN STOK (stok.html)
    // =======================================================
    const stockContainer = document.getElementById('stockContainer');
    if (stockContainer) {
        // Fungsi untuk memuat dan menampilkan semua data stok
        function loadStockData() {
            stockContainer.innerHTML = ''; // Kosongkan kontainer sebelum memuat data baru
            dataBahanAjar.forEach(item => {
                // Di dalam fungsi loadStockData()

// ... baris forEach(item => { ...
const stockCard = `
    <div class="stock-card">
        <div class="img-container">
            <img src="${item.cover || 'assets/placeholder.jpg'}" alt="Cover ${item.namaBarang}">
        </div>
        <div class="stock-card-body">
            <div>
                <h3>${item.namaBarang}</h3>
                <p><strong>Kode:</strong> ${item.kodeBarang}</p>
                <p><strong>Lokasi:</strong> ${item.kodeLokasi}</p>
            </div>
            <div class="stock-info">
                <span>Stok Tersedia</span>
                <span class="stock-badge">${item.stok}</span>
            </div>
        </div>
    </div>
`;
// ... sisa fungsinya tetap sama ...
                stockContainer.innerHTML += stockCard;
            });
        }

        // Muat data saat halaman pertama kali dibuka
        loadStockData();

        // Logika untuk modal tambah stok
        const addStockModal = document.getElementById('addStockModal');
        const addStockBtn = document.getElementById('addStockBtn');
        const closeButton = addStockModal.querySelector('.close-button');
        const addStockForm = document.getElementById('addStockForm');

        addStockBtn.onclick = function() {
            addStockModal.style.display = 'block';
        }

        closeButton.onclick = function() {
            addStockModal.style.display = 'none';
        }

        window.addEventListener('click', function(event) {
            if (event.target == addStockModal) {
                addStockModal.style.display = 'none';
            }
        });
        
        // Event listener untuk form penambahan stok
        addStockForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const newStock = {
                kodeLokasi: document.getElementById('kodeLokasi').value,
                kodeBarang: document.getElementById('kodeBarang').value,
                namaBarang: document.getElementById('namaBarang').value,
                jenisBarang: "BMP", 
                edisi: "N/A",
                stok: parseInt(document.getElementById('stok').value),
                cover: "" // Gambar default karena tidak ada fitur upload
            };
            
            dataBahanAjar.push(newStock);
            loadStockData();
            
            addStockModal.style.display = 'none';
            addStockForm.reset();
        });
    }
});