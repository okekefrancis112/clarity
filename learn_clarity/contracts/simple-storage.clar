(define-data-var stored-value (string-utf8 100) u"")
(define-data-var stored-number uint u0)

(define-public (set-value (value (string-utf8 100)))
  (begin
    (var-set stored-value value)
    (ok true)
  )
)

(define-public (set-number (number uint))
  (begin
    (var-set stored-number number)
    (ok true)
  )
)

(define-read-only (get-value)
  (ok (var-get stored-value))
)

(define-read-only (get-number)
  (ok (var-get stored-number))
)