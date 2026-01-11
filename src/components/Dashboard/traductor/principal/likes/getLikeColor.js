export function getLikeColor(user) {
  // Verificado: azul
  if (user.is_verified) return 'blue';
  // Suscripción alta (>= 8 USD): rojo
  if (user.subscriptionActive && parseFloat(user.subscription_amount) >= 8) return 'red';
  // Suscripción activa: verde
  if (user.subscriptionActive) return 'green';
  // Recomendado por la app: negro
  if (user.is_recommended) return 'black';
  // Like de la app: negro (usuario app‑bot)
  if (user.username === 'app-bot') return 'black';
  // Ninguna categoría: gris
  return 'gray';
}
