;; Simple Storage Smart Contract
;; A simple storage contract that can store a string and a number

;; Data Variables
(define-data-var stored-value (string-utf8 100) u"")
(define-data-var stored-number uint u0)

;; Public Functions

;; Set the stored string value
(define-public (set-value (value (string-utf8 100)))
  (begin
    (var-set stored-value value)
    (ok true)
  )
)

;; Set the stored number value
(define-public (set-number (number uint))
  (begin
    (var-set stored-number number)
    (ok true)
  )
)

;; Read-only Functions
(define-read-only (get-value)
  (ok (var-get stored-value))
)

(define-read-only (get-number)
  (ok (var-get stored-number))
)