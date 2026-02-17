const BASE_URL = 'https://reconnect.stage-eventapp-reconnect.fairfest.in/organizers';

const HEADERS = {
  'sec-ch-ua-platform': '"macOS"',
  'Referer': 'https://stage-reconnect.fairfest.in/',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'sec-ch-ua': '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
  'Content-Type': 'application/json;charset=UTF-8',
  'sec-ch-ua-mobile': '?0'
};

export const authService = {
  async checkUserType(username) {
    try {
      const response = await fetch(`${BASE_URL}/user-type/`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ username })
      });
      return await response.json();
    } catch (error) {
      console.error('Check User Type Error:', error);
      throw error;
    }
  },

  async login(username, password) {
    try {
      const response = await fetch(`${BASE_URL}/signin/`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ username, password })
      });
      return await response.json();
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  async verify2FA(username, code) {
    try {
      const response = await fetch(`${BASE_URL}/verify_2fa/`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ 
          username, 
          email_login_code: code 
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Verify 2FA Error:', error);
      throw error;
    }
  }
};
