$(function () {
    // Any table marked data-table becomes a DataTable. Server-side filters live in the form
    // above each table; DataTables handles sort/search/paging within the filtered set.
    $('table[data-table]').each(function () {
        const $t = $(this)
        $t.DataTable({
            pageLength: Number($t.data('page-length')) || 25,
            order: $t.data('order') ? JSON.parse($t.data('order')) : [],
            // Columns marked data-no-sort (action buttons) shouldn't be sortable.
            columnDefs: [{ targets: 'no-sort', orderable: false, searchable: false }],
            language: { search: '', searchPlaceholder: 'Search…' }
        })
    })

    // Stock View footer: the grand total comes from the server (summed in SQL), not from
    // adding up the rendered cells — DataTables paging would otherwise total only the
    // visible page, and the DECIMAL-as-string problem makes JS summing unsafe anyway.

    // Return form: picking Repair or Damaged sends the asset to IN_REPAIR, not back to stock.
    // Say so before they submit rather than surprising them afterwards.
    const $reason = $('#returnReason')
    if ($reason.length) {
        const $warn = $('#repairWarning')
        const update = function () {
            const v = $reason.val()
            $warn.toggleClass('d-none', v !== 'REPAIR' && v !== 'DAMAGED')
        }
        $reason.on('change', update)
        update()
    }

    // Guard against a double-submit creating two of something. The lock in applyTransition()
    // makes a duplicate POST fail safely rather than double-issue, but not bothering the user
    // with an error they didn't cause is better.
    $('form[data-once]').on('submit', function () {
        const $btn = $(this).find('button[type=submit]')
        $btn.prop('disabled', true).prepend('<span class="spinner-border spinner-border-sm me-2">')
    })
})
