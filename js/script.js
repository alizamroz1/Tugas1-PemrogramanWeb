document.addEventListener('DOMContentLoaded', function() {
    
    // =======================================================
    // LOGIKA GLOBAL (BERLAKU DI SEMUA HALAMAN)
    // =======================================================
    
    // LOGIKA UNTUK BURGER MENU
    const burgerIcon = document.getElementById('burgerIcon');
    const navbarLinks = document.getElementById('navbarLinks');

    if (burgerIcon && navbarLinks) {
        burgerIcon.addEventListener('click', function() {
            navbarLinks.classList.toggle('responsive');
        });
    }

    // LOGIKA UNTUK TOMBOL LOGOUT
    const logoutButton = document.getElementById('logoutButton');
    if(logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('loggedInUserName');
            sessionStorage.removeItem('showWelcomePopup'); 
            window.location.href = 'index.html';
        });
    }

    // =======================================================
    // LOGIKA KHUSUS PER HALAMAN
    // =======================================================

    // --- Logika untuk Halaman LOGIN ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // 1. Logika untuk submit form
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const user = dataPengguna.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('loggedInUserName', user.nama);
                sessionStorage.setItem('showWelcomePopup', 'true');
                window.location.href = 'dashboard.html';
            } else {
                alert('Email atau password yang Anda masukkan salah!');
            }
        });

        // 2. Logika untuk membuka semua modal
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

        // 3. Logika global untuk MENUTUP semua modal
        const closeButtons = document.querySelectorAll('.close-button');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                button.closest('.modal').style.display = 'none';
            });
        });

        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });
    }

    // --- Logika untuk Halaman DASHBOARD ---
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        const userName = localStorage.getItem('loggedInUserName');
        if (userName) {
            document.getElementById('userName').textContent = userName;
        } else {
            window.location.href = 'index.html';
        }

        const now = new Date();
        const hour = now.getHours();
        let greetingText = (hour < 12) ? 'Selamat Pagi' : (hour < 18) ? 'Selamat Siang' : 'Selamat Malam';
        greetingElement.textContent = greetingText;

        if (sessionStorage.getItem('showWelcomePopup') === 'true') {
            Swal.fire({
                title: 'Login Berhasil!',
                html: `Selamat datang kembali, <strong>${userName}</strong>!`,
                icon: 'success',
                timer: 6000,
                timerProgressBar: true,
                confirmButtonText: 'Oke'
            });
            sessionStorage.removeItem('showWelcomePopup');
        }
    }

    // --- Logika untuk Halaman TRACKING ---
    const trackingForm = document.getElementById('trackingForm');
    if (trackingForm) {
        trackingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const doNumber = document.getElementById('doNumber').value;
            const resultContainer = document.getElementById('trackingResult');
            const trackingData = dataTracking[doNumber];

            if (trackingData) {
                let perjalananHtml = '';
                trackingData.perjalanan.forEach(item => {
                    perjalananHtml += `
                        <li class="timeline-item">
                            <span class="timeline-time">${item.waktu}</span>
                            <span class="timeline-description">${item.keterangan}</span>
                        </li>`;
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
                    <ul class="timeline">${perjalananHtml}</ul>`;
            } else {
                alert('Nomor Delivery Order tidak ditemukan!');
                resultContainer.innerHTML = '<p>Silakan masukkan nomor DO yang valid dan klik "Cari".</p>';
            }
        });
    }

    // --- Logika untuk Halaman STOK ---
    const stockContainer = document.getElementById('stockContainer');
    if (stockContainer) {
        function loadStockData() {
            stockContainer.innerHTML = '';
            dataBahanAjar.forEach(item => {
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
                    </div>`;
                stockContainer.innerHTML += stockCard;
            });
        }

        loadStockData(); // Muat data awal

        const addStockModal = document.getElementById('addStockModal');
        const addStockBtn = document.getElementById('addStockBtn');
        const addStockCloseButton = addStockModal.querySelector('.close-button');
        const addStockForm = document.getElementById('addStockForm');

        addStockBtn.onclick = () => { addStockModal.style.display = 'block'; };
        addStockCloseButton.onclick = () => { addStockModal.style.display = 'none'; };
        window.addEventListener('click', (event) => {
            if (event.target == addStockModal) { addStockModal.style.display = 'none'; }
        });

        addStockForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const newStock = {
                kodeLokasi: document.getElementById('kodeLokasi').value,
                kodeBarang: document.getElementById('kodeBarang').value,
                namaBarang: document.getElementById('namaBarang').value,
                stok: parseInt(document.getElementById('stok').value),
                cover: ""
            };
            dataBahanAjar.push(newStock);
            loadStockData();
            addStockModal.style.display = 'none';
            addStockForm.reset();
        });
    }
});
