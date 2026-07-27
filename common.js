async function getCurrentUser() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session ? session.user : null;
}

async function getProfile(userId) {
  const { data } = await supabaseClient.from('profiles').select('*').eq('id', userId).single();
  return data;
}

async function setupNavbar() {
  const user = await getCurrentUser();
  const navLinks = document.getElementById('nav-links');
  if (!navLinks) return;
  if (!user) {
    navLinks.innerHTML = `<a href="login.html">Masuk</a><a href="register.html" class="btn" style="padding:8px 16px;">Daftar</a>`;
    return;
  }
  const profile = await getProfile(user.id);
  let adminLink = '';
  if (profile && profile.is_admin) {
    adminLink = `<a href="admin.html">Admin</a>`;
  }
  navLinks.innerHTML = `${adminLink}<a href="dashboard.html">Pesanan Saya</a><button onclick="logout()">Keluar</button>`;
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = 'index.html';
}

function formatRupiah(angka) {
  return 'Rp' + Number(angka).toLocaleString('id-ID');
}

function statusLabel(status) {
  const labels = {
    menunggu_konfirmasi: 'Menunggu Konfirmasi',
    dikonfirmasi: 'Dikonfirmasi',
    selesai: 'Selesai',
    batal: 'Dibatalkan'
  };
  return labels[status] || status;
}
