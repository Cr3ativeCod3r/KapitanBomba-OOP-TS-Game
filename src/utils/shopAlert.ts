export function showShopAlert(text: string) {
  const alertDiv = document.getElementById('shopAlert');
  if (!alertDiv) return;
  alertDiv.textContent = text;
  setTimeout(() => {
    alertDiv.textContent = '';
  }, 2000);
}
