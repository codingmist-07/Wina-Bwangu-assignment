/* ============================================================================
   capture.js — the transaction capture form

   Covers case study items a, b, c and d: the TransactionID is generated, the
   location follows the booth, the service list is restricted to what the booth
   carries, the revenue per kwacha appears on selection, and tax is computed
   live. Nothing is written until every rule passes.
   ========================================================================== */

(function () {
  'use strict';

  var state = { transactions: [], nextId: null, captured: [], booths: [] };
  var form, boothSelect, serviceSelect, amountInput;

  document.addEventListener('DOMContentLoaded', function () {
    UI.initNav();

    form = UI.$('#capture-form');
    boothSelect = UI.$('#booth');
    serviceSelect = UI.$('#service');
    amountInput = UI.$('#amount');

    fillBooths();
    setFormEnabled(false);
    UI.setBusy(true);

    WinaAPI.loadTransactions(function (error, result) {
      UI.setBusy(false);
      if (error) {
        UI.toast('Register did not load', 'The form stays locked until it does. Reload the page.', 'error');
        return;
      }
      state.transactions = result.transactions;
      UI.$('#ticket-id').textContent = 'Generated on submit';
      setFormEnabled(true);
      UI.announceSource(result);
      updateReceipt();
    });

    boothSelect.addEventListener('change', onBoothChange);
    serviceSelect.addEventListener('change', function () { clearError('service'); updateReceipt(); });
    amountInput.addEventListener('input', function () { clearError('amount'); updateReceipt(); });
    form.addEventListener('submit', onSubmit);
    UI.$('#clear-form').addEventListener('click', function () { resetForm(); UI.toast('Form cleared', null, 'info'); });
  });

  /* --- dropdowns ---------------------------------------------------------- */
  async function fillBooths() {
  try {
   const response = await fetch('http://127.0.0.1:3000/api/booths');

    if (!response.ok) {
      throw new Error('Failed to retrieve booths');
    }

    const booths = await response.json();

    state.booths = booths;

    console.log("Booths from backend:", booths);

    booths.forEach(function (booth) {
      var option = document.createElement('option');

      option.value = booth.booth_code;
      option.textContent = booth.booth_code + ' — ' + booth.location;

      boothSelect.appendChild(option);
    });

  } catch (error) {
    console.error('Booth loading error:', error);

    UI.toast(
      'Could not load booths',
      'The server could not provide the booth list.',
      'error'
    );
  }
}

  /* Item b and c: location is displayed, and the service list is rebuilt from
     the booth's catalogue so an unavailable service cannot be chosen at all. */
 async function onBoothChange() {
  clearError('booth');

  var code = boothSelect.value;

  serviceSelect.innerHTML = '';

  var placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = code ? 'Loading services...' : 'Select a booth first';
  serviceSelect.appendChild(placeholder);

  serviceSelect.disabled = true;

  if (!code) {
    UI.$('#location').value = '';
    UI.$('#service-hint').textContent =
      'The list is restricted to services this booth carries.';
    clearError('service');
    updateReceipt();
    return;
  }
  
  var selectedBooth = state.booths.find(function (booth) {
  return booth.booth_code === code;
});

UI.$('#location').value = selectedBooth ? selectedBooth.location : '';
  
  try {
    const response = await fetch(
  'http://127.0.0.1:3000/api/services/booth/' + encodeURIComponent(code)
);

    if (!response.ok) {
      throw new Error('Failed to retrieve booth services');
    }

    const services = await response.json();
    state.services = services;

    console.log('Services from backend:', state.services);

    services.forEach(function (service) {
      var option = document.createElement('option');

      option.value = service.service_name;
      option.textContent = service.service_name;

      serviceSelect.appendChild(option);
    });

    serviceSelect.disabled = false;

    UI.$('#service-hint').textContent =
      code + ' carries ' + services.length + ' of the 5 services.';

  } catch (error) {
    console.error('Service loading error:', error);

    UI.toast(
      'Could not load services',
      'The server could not provide services for this booth.',
      'error'
    );

    UI.$('#service-hint').textContent =
      'Unable to load services for this booth.';
  }

  clearError('service');
  updateReceipt();
}
  /* --- live receipt ------------------------------------------------------- */
  function updateReceipt() {
    var service = state.services
  ? state.services.find(function (service) {
      return service.service_name === serviceSelect.value;
    })
  : null;

    console.log('Selected service:', service);
    console.log('Selected value:', serviceSelect.value);

    var amount = Number(amountInput.value);
    var valid = service && !isNaN(amount) && amount > 0;
    var selectedBooth = state.booths.find(function (booth) {
      return booth.booth_code === boothSelect.value;
    });

    UI.$('#rate').value = service ? Number(service.rate).toFixed(3) + ' per kwacha' : '';
    UI.$('#r-booth').textContent = boothSelect.value
      ? boothSelect.value + ' · ' + (selectedBooth ? selectedBooth.location : '')
      : '—';
    UI.$('#r-service').textContent = service ? service.service_name : '—';
    UI.$('#r-amount').textContent = valid ? UI.money(amount, 2) : '—';

    if (!valid) {
      ['r-commission', 'r-tax', 'r-net', 'r-after'].forEach(function (id) {
        UI.$('#' + id).textContent = '—';
      });
      setFloatNote(null);
      return;
    }

    var p = WinaStore.priceOne(amount, service.rate);
    UI.$('#r-commission').textContent = UI.money(p.commission);
    UI.$('#r-tax').textContent = UI.money(p.vat);
    UI.$('#r-net').textContent = UI.money(p.netRevenue);
    UI.$('#r-after').textContent = UI.money(p.amountAfterTax);
   setFloatNote(
  WinaStore.checkFloat(state.transactions, service, amount)
);
  }

  function setFloatNote(check) {
    var note = UI.$('#float-note');

     note.className = 'float-note';
    if (!check) {
      note.textContent = 'Choose a booth, a service and an amount to price the transaction.';
      return;
    }
    if (!check.ok) {
      note.classList.add('is-blocked');
      note.textContent =
        'Over the monthly limit by ' + UI.money(check.shortfall, 0) +
        '. Only ' + UI.money(check.remaining, 0) + ' of credit is left on this service.';
      return;
    }
    var share = check.limit ? (check.limit - check.after) / check.limit : 0;
    if (share >= 0.9) { note.classList.add('is-tight'); }
    note.textContent =
      UI.money(check.after, 0) + ' of credit would remain on this service after the transaction.';
  }

  /* --- validation ---------------------------------------------------------
     Every rule reports against its own field and is repeated in a toast, so
     the outcome is visible whether the agent is looking at the form or not. */
  function validate() {
    var errors = [];

    if (!boothSelect.value) {
      errors.push({ field: 'booth', message: 'Choose the booth the transaction was made at.' });
    }
    if (!serviceSelect.value) {
      errors.push({ field: 'service', message: 'Choose a service.' });
    } 

    var raw = String(amountInput.value).trim();
    var amount = Number(raw);
    if (!raw) {
      errors.push({ field: 'amount', message: 'Enter the transaction amount.' });
    } else if (isNaN(amount)) {
      errors.push({ field: 'amount', message: 'Amounts must be numbers only — no spaces or letters.' });
    } else if (amount <= 0) {
      errors.push({ field: 'amount', message: 'The amount must be greater than zero.' });
    } else if (!/^\d+(\.\d{1,2})?$/.test(raw)) {
      errors.push({ field: 'amount', message: 'Use at most two decimal places.' });
    } else if (amount < WINA.RULES.MIN_AMOUNT) {
      errors.push({ field: 'amount', message: 'The counter minimum is ' + UI.money(WINA.RULES.MIN_AMOUNT, 0) + '.' });
    } else if (amount > WINA.RULES.MAX_AMOUNT) {
      errors.push({ field: 'amount', message: 'Single transactions are capped at ' + UI.money(WINA.RULES.MAX_AMOUNT, 0) + '.' });
    } else if (serviceSelect.value) {
      var selectedService = state.services
  ? state.services.find(function (service) {
      return service.service_name === serviceSelect.value;
    })
  : null;

      var check = WinaStore.checkFloat(
        state.transactions,
        selectedService,
        amount
      );
      if (!check.ok) {
        errors.push({
          field: 'amount',
          message: 'Only ' + UI.money(check.remaining, 0) + ' left on ' + serviceSelect.value + ' this month.'
        });
      }
    }

    return errors;
  }

  function showError(field, message) {
    var wrap = UI.$('[data-field="' + field + '"]');
    if (!wrap) { return; }
    wrap.classList.add('is-invalid');
    UI.$('.field__error', wrap).textContent = message;
    var control = UI.$('input, select', wrap);
    if (control) { control.setAttribute('aria-invalid', 'true'); }
  }

  function clearError(field) {
    var wrap = UI.$('[data-field="' + field + '"]');
    if (!wrap) { return; }
    wrap.classList.remove('is-invalid');
    var control = UI.$('input, select', wrap);
    if (control) { control.removeAttribute('aria-invalid'); }
  }

  function clearAllErrors() {
    ['booth', 'service', 'amount'].forEach(clearError);
  }

  /* --- submit ------------------------------------------------------------- */
  function onSubmit(event) {
    event.preventDefault();
    clearAllErrors();

    var errors = validate();

    if (errors.length) {
        errors.forEach(function (e) {
            showError(e.field, e.message);
        });

        UI.toast(
            errors.length === 1
                ? 'One field needs attention'
                : errors.length + ' fields need attention',
            errors[0].message,
            'error'
        );

        var first = UI.$(
            '[data-field="' + errors[0].field + '"] input, [data-field="' +
            errors[0].field + '"] select'
        );

        if (first) {
            first.focus();
        }

        return;
    }

    var boothCode = boothSelect.value;
    var serviceName = serviceSelect.value;
    var transactionAmount = Number(amountInput.value);

    setFormEnabled(false);
    UI.setBusy(true);
    UI.$('#submit').textContent = 'Recording…';

    fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            boothCode: boothCode,
            serviceName: serviceName,
            transactionAmount: transactionAmount
        })
    })
    .then(function (response) {
        return response.json().then(function (data) {
            if (!response.ok) {
                throw new Error(
                    data.message || 'Transaction was rejected'
                );
            }

            return data;
        });
    })
    .then(function (data) {

        var selectedBooth = state.booths.find(function (booth) {
          return booth.booth_code === data.boothCode;
        });

        var record = {
          transactionId: data.transactionId,
          booth: data.boothCode,
          location: selectedBooth ? selectedBooth.location : '',
          service: data.serviceName,
          revenuePerKwacha: data.rate,
          transactionAmount: data.transactionAmount
        };

        UI.$('#ticket-id').textContent = data.transactionId;
        
        // Add the new transaction to this page's state
        state.transactions.push(record);

        UI.setRegisterCount(state.transactions.length);

        var p = {
          commission: Number(data.commission),
          vat: Number(data.tax),
          netRevenue: Number(data.revenueAfterTax),
          amountAfterTax: Number(data.amountAfterTax)
        };

        UI.toast(
            'Recorded ' + record.transactionId,
            UI.money(record.transactionAmount, 0) +
            ' on ' + record.service +
            ' at ' + record.booth +
            ' · ' + UI.money(p.commission) + ' commission.',
            'success'
        );

        addToLog(record, p);
        warnIfTight(record.service);
        resetForm();

        UI.setBusy(false);
        UI.$('#submit').textContent = 'Record transaction';
        setFormEnabled(true);
    })
    .catch(function (error) {
        console.error(error);

        UI.toast(
            'Not recorded',
            error.message,
            'error'
        );

        UI.setBusy(false);
        UI.$('#submit').textContent = 'Record transaction';
        setFormEnabled(true);
    });
}

  function addToLog(record, priced) {
    var log = UI.$('#session-log');
    var empty = UI.$('#session-empty');
    if (empty) { empty.remove(); }
    var item = document.createElement('li');
    var left = UI.el('span', '', record.transactionId + ' · ' + record.service);
    var right = UI.el('span', '', UI.money(record.transactionAmount, 0) + ' → ' + UI.money(priced.commission));
    item.appendChild(left);
    item.appendChild(right);
    log.insertBefore(item, log.firstChild);
    state.captured.push(record);
    UI.$('#session-count').textContent =
      state.captured.length + (state.captured.length === 1 ? ' transaction' : ' transactions');
  }

  function warnIfTight(serviceName) {
  var service = state.services
    ? state.services.find(function (service) {
        return service.service_name === serviceName;
      })
    : null;

  var check = WinaStore.checkFloat(state.transactions, service, 0);

  if (check.limit && check.remaining / check.limit <= 0.1) {
    UI.toast(
      serviceName + ' float is nearly gone',
      UI.money(check.remaining, 0) +
      ' left of ' +
      UI.money(check.limit, 0) +
      ' for the month.',
      'warning'
    );
  }
}

  function resetForm() {
    form.reset();
    clearAllErrors();
    serviceSelect.innerHTML = '<option value="">Select a booth first</option>';
    serviceSelect.disabled = true;
    UI.$('#location').value = '';
    UI.$('#rate').value = '';
    UI.$('#service-hint').textContent = 'The list is restricted to services this booth carries.';
    UI.$('#ticket-id').textContent = 'Generated on submit';
    updateReceipt();
    boothSelect.focus();
  }

  function setFormEnabled(on) {
    boothSelect.disabled = !on;
    amountInput.disabled = !on;
    UI.$('#submit').disabled = !on;
    UI.$('#clear-form').disabled = !on;
    if (!on) { serviceSelect.disabled = true; }
    else if (boothSelect.value) { serviceSelect.disabled = false; }
  }
})();
