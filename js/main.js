$(function () {
  // Set to a backend / Formspree / Google Apps Script URL to deliver leads.
  // Empty = demo mode: the form is validated and a thank-you toast is shown, nothing is sent.
  var LEAD_ENDPOINT = "";

  var data = window.EVENT_DATA || { categories: {}, equipmentTypes: {}, combos: [], equipment: [], projects: [] };

  var equipmentIcons = {
    speaker: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><circle cx="12" cy="6.5" r="1.5"/>',
    mic: '<rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/>',
    mixer: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7v10M12 7v10M16 7v10"/><path d="M6.5 10h3M10.5 14h3M14.5 9h3"/>',
    light: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
    led: '<rect x="2" y="4" width="20" height="13" rx="1"/><path d="M8 21h8M12 17v4"/>',
    accessory: '<path d="M4 20 20 4M4 4l16 16M4 12h16M12 4v16"/>'
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function photo(id, width) {
    return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + width + "&q=80";
  }

  var toastTimer;
  function showToast(message) {
    window.clearTimeout(toastTimer);
    $(".toast").text(message).addClass("show");
    toastTimer = window.setTimeout(function () {
      $(".toast").removeClass("show");
    }, 4500);
  }

  function submitLead(payload) {
    if (!LEAD_ENDPOINT) {
      return $.Deferred().resolve().promise();
    }
    return $.ajax({ url: LEAD_ENDPOINT, method: "POST", data: payload, dataType: "json" });
  }

  // Mobile menu
  $(".menu-toggle").on("click", function () {
    var isOpen = $(".nav").toggleClass("open").hasClass("open");
    $(this).attr("aria-expanded", isOpen ? "true" : "false").text(isOpen ? "×" : "☰");
  });

  $(".nav a").on("click", function () {
    $(".nav").removeClass("open");
    $(".menu-toggle").attr("aria-expanded", "false").text("☰");
  });

  // Hero slider (home page)
  var slides = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2000&q=85",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=85"
  ];
  var $dots = $(".slider-dot");
  var slideTimer;

  function showSlide(index) {
    $dots.removeClass("active").attr("aria-selected", "false");
    $dots.eq(index).addClass("active").attr("aria-selected", "true");
    $(".hero").css("background-image", "url('" + slides[index] + "')");
  }

  function startSlider() {
    window.clearInterval(slideTimer);
    slideTimer = window.setInterval(function () {
      showSlide(($dots.filter(".active").index() + 1) % slides.length);
    }, 6000);
  }

  if ($dots.length) {
    $dots.on("click", function () {
      showSlide($(this).index());
      startSlider();
    });
    startSlider();
  }

  // Renderers
  function comboCard(combo) {
    return '<article class="combo-card" data-category="' + escapeHtml(combo.category) + '">' +
      '<div class="combo-media">' +
        '<img src="' + photo(combo.image, 800) + '" alt="' + escapeHtml(combo.name) + '" loading="lazy">' +
        (combo.badge ? '<span class="badge">' + escapeHtml(combo.badge) + "</span>" : "") +
      "</div>" +
      '<div class="combo-body">' +
        '<span class="combo-meta">' + escapeHtml(data.categories[combo.category] || "") + " · " + escapeHtml(combo.guests) + "</span>" +
        "<h3>" + escapeHtml(combo.name) + "</h3>" +
        "<p>" + escapeHtml(combo.description) + "</p>" +
        '<ul class="check-list">' + $.map(combo.items, function (item) { return "<li>" + escapeHtml(item) + "</li>"; }).join("") + "</ul>" +
        '<div class="combo-foot">' +
          '<span class="price">Giá tham khảo<strong>' + escapeHtml(combo.price) + "</strong></span>" +
          '<a class="button button-primary button-sm" href="booking.html?combo=' + encodeURIComponent(combo.id) + '">Yêu cầu báo giá</a>' +
        "</div>" +
      "</div>" +
    "</article>";
  }

  function equipmentCard(item) {
    return '<article class="equip-card" data-category="' + escapeHtml(item.type) + '">' +
      '<svg class="equip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (equipmentIcons[item.type] || "") + "</svg>" +
      "<h3>" + escapeHtml(item.name) + "</h3>" +
      '<p class="equip-spec">' + escapeHtml(item.spec) + "</p>" +
      '<p class="equip-desc">' + escapeHtml(item.description) + "</p>" +
      '<a class="button button-ghost button-sm" href="booking.html?item=' + encodeURIComponent(item.id) + '">Báo giá thuê</a>' +
    "</article>";
  }

  function projectCard(project, index) {
    return '<button class="gallery-item" type="button" data-category="' + escapeHtml(project.category) + '" data-index="' + index + '">' +
      '<img src="' + photo(project.image, 800) + '" alt="' + escapeHtml(project.title) + '" loading="lazy">' +
      '<span class="gallery-caption"><strong>' + escapeHtml(project.title) + "</strong>" +
      "<span>" + escapeHtml(data.categories[project.category] || "") + " · " + escapeHtml(project.location) + " · " + escapeHtml(project.date) + "</span></span>" +
    "</button>";
  }

  var $comboList = $("#combo-list");
  if ($comboList.length) {
    var combos = $comboList.data("featured") ? $.grep(data.combos, function (combo) { return combo.featured; }) : data.combos;
    $comboList.html($.map(combos, comboCard).join(""));
  }

  $("#equipment-list").html($.map(data.equipment, equipmentCard).join(""));

  var $projectList = $("#project-list");
  if ($projectList.length) {
    var limit = $projectList.data("limit") || data.projects.length;
    $projectList.html($.map(data.projects.slice(0, limit), projectCard).join(""));
  }

  // Filter tabs: <div class="filter-tabs" data-target="#list"><button data-filter="key">
  $(".filter-tabs[data-target]").on("click", ".filter-tab", function () {
    var $tab = $(this);
    var filter = $tab.data("filter");
    var $tabs = $tab.closest(".filter-tabs");
    var $list = $($tabs.data("target"));

    $tabs.find(".filter-tab").removeClass("active").attr("aria-pressed", "false");
    $tab.addClass("active").attr("aria-pressed", "true");
    $list.children().each(function () {
      $(this).toggle(filter === "all" || $(this).data("category") === filter);
    });
  });

  var params = new URLSearchParams(window.location.search);
  if (params.get("category")) {
    $(".filter-tabs[data-target] .filter-tab").filter(function () {
      return $(this).data("filter") === params.get("category");
    }).trigger("click");
  }

  // Lightbox (projects)
  var $lightbox = $(".lightbox");
  var lastFocus;

  function closeLightbox() {
    $lightbox.removeClass("open").attr("aria-hidden", "true");
    if (lastFocus) lastFocus.focus();
  }

  $("#project-list").on("click", ".gallery-item", function () {
    var project = data.projects[$(this).data("index")];
    if (!$lightbox.length || !project) return;
    lastFocus = this;
    $lightbox.find("img").attr({ src: photo(project.image, 1600), alt: project.title });
    $lightbox.find("figcaption").text(project.title + " · " + project.location + " · " + project.date);
    $lightbox.addClass("open").attr("aria-hidden", "false");
    $lightbox.find(".lightbox-close").trigger("focus");
  });

  $lightbox.on("click", function (event) {
    if (event.target === this || $(event.target).closest(".lightbox-close").length) closeLightbox();
  });

  $(document).on("keydown", function (event) {
    if (event.key === "Escape" && $lightbox.hasClass("open")) closeLightbox();
  });

  // Booking form options + prefill from query string (?service= / ?combo= / ?item=)
  var $booking = $("#booking-form");
  if ($booking.length) {
    var $service = $booking.find("[name=service]");
    var $combo = $booking.find("[name=combo]");
    var $types = $("#equipment-types");

    $.each(data.categories, function (key, name) {
      $service.append($("<option>").val(key).text(name));
    });
    $.each(data.combos, function (index, combo) {
      $combo.append($("<option>").val(combo.id).text(combo.name + " (" + combo.guests + ")"));
    });
    $.each(data.equipmentTypes, function (key, name) {
      $types.append(
        $('<label class="check-chip">').append(
          $('<input type="checkbox" name="equipment">').val(key),
          $("<span>").text(name)
        )
      );
    });

    if (data.categories[params.get("service")]) {
      $service.val(params.get("service"));
    }

    var selectedCombo = $.grep(data.combos, function (combo) { return combo.id === params.get("combo"); })[0];
    if (selectedCombo) {
      $combo.val(selectedCombo.id);
      $service.val(selectedCombo.category);
    }

    var selectedItem = $.grep(data.equipment, function (item) { return item.id === params.get("item"); })[0];
    if (selectedItem) {
      $types.find("input").filter(function () { return this.value === selectedItem.type; }).prop("checked", true);
      $booking.find("[name=equipment_detail]").val(selectedItem.name);
    }
  }

  // Event date cannot be in the past
  var now = new Date();
  var today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  $("input[type=date]").attr("min", today);

  // Lead forms (quick quote + booking)
  $(".js-lead-form").on("submit", function (event) {
    event.preventDefault();
    var form = this;
    var $button = $(form).find("[type=submit]");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    $button.prop("disabled", true);
    submitLead($(form).serialize())
      .done(function () {
        showToast("Cảm ơn bạn! Event Pro đã nhận yêu cầu và sẽ liên hệ báo giá trong thời gian sớm nhất.");
        form.reset();
      })
      .fail(function () {
        showToast("Gửi chưa thành công. Vui lòng gọi hotline 0987 654 321 hoặc nhắn Zalo để được hỗ trợ ngay.");
      })
      .always(function () {
        $button.prop("disabled", false);
      });
  });
});
