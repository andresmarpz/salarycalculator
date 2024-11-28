import { motion } from 'framer-motion'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200"
        animate={{
          background: [
            'linear-gradient(to bottom right, #f0fff4, #c6f6d5)',
            'linear-gradient(to bottom right, #c6f6d5, #9ae6b4)',
            'linear-gradient(to bottom right, #9ae6b4, #68d391)',
            'linear-gradient(to bottom right, #68d391, #48bb78)',
            'linear-gradient(to bottom right, #48bb78, #38a169)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.4" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")',
        }}
      />
    </div>
  )
}

