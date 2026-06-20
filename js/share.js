// Share button: native Web Share sheet on supported devices (mobile),
// custom deep-link panel as a fallback (desktop / Firefox).
(function () {
  var url = 'https://cicholas.pl/';
  var title = 'Cicho Las — domek nad Jeziorem Cichowo';
  var text = 'Drewniany domek letniskowy do wynajęcia nad Jeziorem Cichowo. Zobacz:';
  var shareData = { title: title, text: text, url: url };

  var btn = document.getElementById('shareBtn');
  var panel = document.getElementById('sharePanel');
  if (!btn) return;

  function onKey(e) { if (e.key === 'Escape') closePanel(); }

  function openPanel() {
    if (!panel) return;
    var msg = text + ' ' + url;
    var enc = encodeURIComponent(msg);

    var wa = document.getElementById('shareWhatsApp');
    if (wa) wa.href = 'https://wa.me/?text=' + enc;

    var sms = document.getElementById('shareSms');
    if (sms) {
      // iOS expects sms:&body=, Android sms:?body=
      var isIOS = /iP(hone|ad|od)/.test(navigator.userAgent);
      sms.href = 'sms:' + (isIOS ? '&body=' : '?body=') + enc;
    }

    var mail = document.getElementById('shareMail');
    if (mail) {
      mail.href = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + enc;
    }

    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', onKey);
  }

  function closePanel() {
    if (!panel) return;
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKey);
  }

  btn.addEventListener('click', function () {
    if (navigator.share) {
      // Native OS share sheet (SMS / WhatsApp / Messenger / contacts...).
      navigator.share(shareData).catch(function () { /* user cancelled — ignore */ });
    } else {
      openPanel();
    }
  });

  if (panel) {
    panel.addEventListener('click', function (e) {
      if (e.target.closest('[data-share-close]')) closePanel();
    });

    var copy = document.getElementById('shareCopy');
    if (copy) {
      copy.addEventListener('click', function () {
        var label = copy.querySelector('.share-opt__label');
        var flash = function () {
          if (!label) return;
          var prev = label.textContent;
          label.textContent = 'Skopiowano ✓';
          setTimeout(function () { label.textContent = prev; }, 1600);
        };
        var fallbackCopy = function () {
          var ta = document.createElement('textarea');
          ta.value = url;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); flash(); } catch (err) { /* noop */ }
          document.body.removeChild(ta);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(flash).catch(fallbackCopy);
        } else {
          fallbackCopy();
        }
      });
    }
  }
})();
