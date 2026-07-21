const GITHUB_API_URL = 'https://api.github.com';

/**
 * Dispara el workflow de GitHub Actions que reconstruye y redeploya el landing
 * (sitio estático en S3/CloudFront) para que los posts nuevos aparezcan sin
 * esperar al siguiente deploy manual.
 */
const triggerLandingRedeploy = async () => {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_LANDING_REPO;

  if (!token || !repo) {
    console.warn('[DeployService] GITHUB_TOKEN o GITHUB_LANDING_REPO no configurados, no se dispara el redeploy del landing.');
    return;
  }

  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${repo}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_type: 'post-published' }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`[DeployService] GitHub respondió ${response.status} al disparar el redeploy:`, body);
      return;
    }

    console.log('[DeployService] Redeploy del landing disparado correctamente.');
  } catch (error) {
    console.error('[DeployService] Error al disparar el redeploy del landing:', error.message);
  }
};

module.exports = { triggerLandingRedeploy };
