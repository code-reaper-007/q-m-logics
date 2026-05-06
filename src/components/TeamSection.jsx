import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award } from 'lucide-react';

const teamMembers = [
  {
    roll: 'RA2511036010519',
    name: 'SOUJATA MAJI',
  },
  {
    roll: 'RA2511036010534',
    name: 'PRANAY KUMAR SINGH',
  },
  {
    roll: 'RA2511036010537',
    name: 'PRASHANT KUMAR DAS',
  },
  {
    roll: 'RA2511036010542',
    name: 'PIYUSH RAJ',
  },
];

export const TeamSection = () => {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="space-y-10"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass border border-white/10">
            <Award className="w-4 h-4 text-accent-cyan" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Team SP3</span>
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Meet the <span className="text-accent-cyan">Developers</span>
          </h2>
          <p className="text-sm text-white/40 max-w-lg mx-auto">
            The team behind Q-M Logics — a dual-mode Quine-McCluskey Boolean logic optimization suite.
          </p>
        </div>

        {/* Team Photo */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative max-w-2xl w-full"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-cyan/20 via-accent-purple/20 to-accent-cyan/20 rounded-2xl blur-lg" />
            <div className="relative glass border border-white/10 rounded-2xl overflow-hidden">
              <img
                src="/050927c5-736a-4fad-90be-c5679b1e024b.png"
                alt="Team SP3"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-40" />
            </div>
          </motion.div>
        </div>

        {/* Members Grid */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Users className="w-5 h-5 text-accent-cyan" />
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-[0.2em]">Team Members</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.roll}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                className="group glass border border-white/5 hover:border-accent-cyan/30 transition-all duration-300 p-5 rounded-xl hover:shadow-[0_0_20px_rgba(0,243,255,0.1)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-white/80">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-accent-cyan transition-colors">
                      {member.name}
                    </p>
                    <p className="text-xs font-mono text-white/30 mt-0.5">
                      {member.roll}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Project Info */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass border border-white/5 rounded-xl p-6 space-y-4"
          >
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-[0.2em] text-center">About Q-M Logics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-accent-cyan">10</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Max Variables</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-accent-purple">2</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Modes (SOP/POS)</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">O(3ⁿ)</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Algorithm Complexity</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
