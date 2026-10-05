// =========================================================
// KARANG TARUNA KPR PDAM KLAWUYUK
// JavaScript: navbar, scroll active, lightbox, uang kas
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("mainHeader");
  const menuToggle = document.getElementById("menuToggle");
  const bubbleNav = document.getElementById("bubbleNav");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile bubble navbar
  menuToggle.addEventListener("click", () => {
    bubbleNav.classList.toggle("open");
    document.body.classList.toggle("menu-open");
    const icon = menuToggle.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      bubbleNav.classList.remove("open");
      document.body.classList.remove("menu-open");
      const icon = menuToggle.querySelector("i");
      icon.classList.add("fa-bars");
      icon.classList.remove("fa-xmark");
    });
  });

  // Header saat scroll
  const handleScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  // Active nav
  const sections = document.querySelectorAll("main section[id]");
  const updateActive = () => {
    let current = "beranda";
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  };
  window.addEventListener("scroll", updateActive);
  updateActive();

  // Tahun footer
  document.getElementById("year").textContent = new Date().getFullYear();

  

  // =========================
  // UANG KAS - LOCAL STORAGE
  // =========================
  const cashForm = document.getElementById("cashForm");
  const cashDate = document.getElementById("cashDate");
  const cashType = document.getElementById("cashType");
  const cashNote = document.getElementById("cashNote");
  const cashAmount = document.getElementById("cashAmount");
  const cashBalance = document.getElementById("cashBalance");
  const cashIncome = document.getElementById("cashIncome");
  const cashExpense = document.getElementById("cashExpense");
  const cashTableBody = document.getElementById("cashTableBody");
  const cashEmpty = document.getElementById("cashEmpty");
  const clearCash = document.getElementById("clearCash");

  const STORAGE_KEY = "kt_kpr_pdam_klawuyuk_cash";

  cashDate.value = new Date().toISOString().slice(0, 10);

  const getTransactions = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  };

  const saveTransactions = data => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const rupiah = value => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = value => {
    if (!value) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit", month: "short", year: "numeric"
    }).format(new Date(value + "T00:00:00"));
  };

  const renderCash = () => {
    const data = getTransactions();
    let income = 0;
    let expense = 0;

    data.forEach(item => {
      if (item.type === "income") income += Number(item.amount);
      else expense += Number(item.amount);
    });

    cashIncome.textContent = rupiah(income);
    cashExpense.textContent = rupiah(expense);
    cashBalance.textContent = rupiah(income - expense);

    cashTableBody.innerHTML = "";

    if (!data.length) {
      cashEmpty.style.display = "block";
      return;
    }

    cashEmpty.style.display = "none";

    data.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    data.forEach(item => {
      const tr = document.createElement("tr");
      const isIncome = item.type === "income";
      tr.innerHTML = `
        <td>${formatDate(item.date)}</td>
        <td><strong>${escapeHtml(item.note)}</strong></td>
        <td>
          <span class="type-badge ${isIncome ? "type-income" : "type-expense"}">
            ${isIncome ? "Pemasukan" : "Pengeluaran"}
          </span>
        </td>
        <td style="font-weight:800; color:${isIncome ? "#188b54" : "#c8102e"}">
          ${isIncome ? "+" : "-"} ${rupiah(Number(item.amount))}
        </td>
        <td><button class="delete-row" data-id="${item.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button></td>
      `;
      cashTableBody.appendChild(tr);
    });

    document.querySelectorAll(".delete-row").forEach(button => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        const updated = getTransactions().filter(item => item.id !== id);
        saveTransactions(updated);
        renderCash();
      });
    });
  };

  const escapeHtml = value => {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  cashForm.addEventListener("submit", e => {
    e.preventDefault();

    const amount = Number(cashAmount.value);
    if (!amount || amount <= 0) return;

    const data = getTransactions();
    data.push({
      id: Date.now().toString(),
      date: cashDate.value,
      type: cashType.value,
      note: cashNote.value.trim(),
      amount
    });

    saveTransactions(data);
    cashForm.reset();
    cashDate.value = new Date().toISOString().slice(0, 10);
    cashType.value = "income";
    renderCash();
  });

  clearCash.addEventListener("click", () => {
    const data = getTransactions();
    if (!data.length) return;

    const confirmed = confirm("Hapus semua data uang kas dari browser ini?");
    if (confirmed) {
      localStorage.removeItem(STORAGE_KEY);
      renderCash();
    }
  });

  renderCash();
});


/* =========================================================
   MODAL SK PENGANGKATAN
========================================================= */

function openSK() {
    const modal = document.getElementById("skModal");

    if (!modal) return;

    modal.classList.add("active");

    document.body.classList.add("modal-open");
}


function closeSK() {
    const modal = document.getElementById("skModal");

    if (!modal) return;

    modal.classList.remove("active");

    document.body.classList.remove("modal-open");
}


/* ESC UNTUK MENUTUP */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeSK();
    }

});


/* =====================================================
   LIGHTBOX GALERI
===================================================== */

const galleryPhotos = [
  {
    src: "images/galeri-1.jpg",
    title: "Kegiatan Pemuda"
  },
  {
    src: "images/galeri-2.jpg",
    title: "Gotong Royong"
  },
  {
    src: "images/galeri-3.jpg",
    title: "Kegiatan Sosial"
  },
  {
    src: "images/galeri-4.jpg",
    title: "Olahraga Pemuda"
  },
  {
    src: "images/galeri-5.jpg",
    title: "Kerja Bakti"
  },
  {
    src: "images/galeri-6.jpg",
    title: "Kebersamaan"
  }
];

let currentGalleryIndex = 0;


/* BUKA GALERI */

function openGallery(index) {

  currentGalleryIndex = index;

  const lightbox =
    document.getElementById("galleryLightbox");

  const image =
    document.getElementById("galleryLightboxImage");

  const title =
    document.getElementById("galleryLightboxTitle");

  const photo =
    galleryPhotos[currentGalleryIndex];

  image.src = photo.src;
  image.alt = photo.title;

  title.textContent = photo.title;

  lightbox.classList.add("active");

  document.body.style.overflow = "hidden";
}


/* TUTUP GALERI */

function closeGallery() {

  const lightbox =
    document.getElementById("galleryLightbox");

  lightbox.classList.remove("active");

  document.body.style.overflow = "";
}


/* FOTO SEBELUMNYA */

function prevGallery() {

  currentGalleryIndex--;

  if (currentGalleryIndex < 0) {
    currentGalleryIndex =
      galleryPhotos.length - 1;
  }

  updateGallery();
}


/* FOTO BERIKUTNYA */

function nextGallery() {

  currentGalleryIndex++;

  if (
    currentGalleryIndex >=
    galleryPhotos.length
  ) {
    currentGalleryIndex = 0;
  }

  updateGallery();
}


/* UPDATE FOTO */

function updateGallery() {

  const image =
    document.getElementById("galleryLightboxImage");

  const title =
    document.getElementById("galleryLightboxTitle");

  const photo =
    galleryPhotos[currentGalleryIndex];

  image.src = photo.src;
  image.alt = photo.title;

  title.textContent = photo.title;
}


/* ESC UNTUK MENUTUP */

document.addEventListener("keydown", function(event) {

  const lightbox =
    document.getElementById("galleryLightbox");

  if (!lightbox.classList.contains("active")) {
    return;
  }

  if (event.key === "Escape") {
    closeGallery();
  }

  if (event.key === "ArrowLeft") {
    prevGallery();
  }

  if (event.key === "ArrowRight") {
    nextGallery();
  }

});


/* KLIK AREA GELAP UNTUK MENUTUP */

document
  .getElementById("galleryLightbox")
  .addEventListener("click", function(event) {

    if (event.target === this) {
      closeGallery();
    }

  });
