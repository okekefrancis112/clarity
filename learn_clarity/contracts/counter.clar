;; Counter Smart Contract
;; A simple counter that can be incremented and decremented

;; Data Variables
(define-data-var counter uint u0)
(define-data-var owner principal tx-sender)

;; Constants
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_COUNTER_UNDERFLOW (err u101))
(define-constant ERR_SAME_OWNER (err u102))
(define-constant ERR_INVALID_PRINCIPAL (err u103))
(define-constant ERR_INVALID_AMOUNT (err u104))

;; Public Functions

;; Increment the counter by 1
(define-public (increment)
  (begin
    (var-set counter (+ (var-get counter) u1))
    (ok (var-get counter))
  )
)

;; Decrement the counter by 1 (prevents underflow)
(define-public (decrement)
  (let ((current-counter (var-get counter)))
    (if (> current-counter u0)
      (begin
        (var-set counter (- current-counter u1))
        (ok (var-get counter))
      )
      ERR_COUNTER_UNDERFLOW
    )
  )
)

;; Increment counter by a specific amount
(define-public (increment-by (amount uint))
  (begin
    (asserts! (> amount u0) (err u104))
    (var-set counter (+ (var-get counter) amount))
    (ok (var-get counter))
  )
)

;; Decrement counter by a specific amount (prevents underflow)
(define-public (decrement-by (amount uint))
  (let ((current-counter (var-get counter)))
    (if (>= current-counter amount)
      (begin
        (var-set counter (- current-counter amount))
        (ok (var-get counter))
      )
      ERR_COUNTER_UNDERFLOW
    )
  )
)

;; Reset counter to zero (only owner can do this)
(define-public (reset)
  (if (is-eq tx-sender (var-get owner))
    (begin
      (var-set counter u0)
      (ok u0)
    )
    ERR_UNAUTHORIZED
  )
)

;; Transfer ownership (only current owner can do this)
(define-public (transfer-ownership (new-owner principal))
  (if (is-eq tx-sender (var-get owner))
    (begin
      (asserts! (not (is-eq new-owner (var-get owner))) (err u102))
      (asserts! (is-standard new-owner) (err u103))
      (var-set owner new-owner)
      (ok new-owner)
    )
    ERR_UNAUTHORIZED
  )
)

;; Read-only Functions

;; Get the current counter value
(define-read-only (get-counter)
  (var-get counter)
)

;; Get the current owner
(define-read-only (get-owner)
  (var-get owner)
)

;; Check if caller is the owner
(define-read-only (is-owner (caller principal))
  (is-eq caller (var-get owner))
)