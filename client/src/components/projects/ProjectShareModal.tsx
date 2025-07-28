"use client"

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updateProjectLocal } from '@/store/slices/projectsSlice';
import { Project, ProjectMember } from '@/types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Share2, 
  Users, 
  Copy, 
  Mail, 
  Link2,
  UserPlus,
  Crown,
  Shield,
  Eye,
  X,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProjectShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

type ShareMethod = 'link' | 'email' | 'invite';

export function ProjectShareModal({ isOpen, onClose, project }: ProjectShareModalProps) {
  const dispatch = useAppDispatch();
  const [shareMethod, setShareMethod] = useState<ShareMethod>('link');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<ProjectMember['role']>('member');
  const [inviteMessage, setInviteMessage] = useState('');
  const [linkPermission, setLinkPermission] = useState<'viewer' | 'member'>('viewer');
  const [loading, setLoading] = useState(false);

  // Mock share link generation
  const generateShareLink = (permission: 'viewer' | 'member') => {
    const baseUrl = window.location.origin;
    const shareId = btoa(`${project.id}-${permission}-${Date.now()}`).slice(0, 16);
    return `${baseUrl}/shared/project/${shareId}?role=${permission}`;
  };

  const handleCopyLink = async () => {
    const shareLink = generateShareLink(linkPermission);
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Share link copied to clipboard!');
    }
  };

  const handleSendEmail = async () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      // Mock email invitation
      const shareLink = generateShareLink(inviteRole === 'owner' || inviteRole === 'admin' ? 'member' : inviteRole);
      const subject = `Invitation to collaborate on "${project.name}"`;
      const body = `You've been invited to collaborate on the project "${project.name}".
      
${inviteMessage || 'Join me in working on this project!'}

Click here to access the project: ${shareLink}

Role: ${inviteRole.charAt(0).toUpperCase() + inviteRole.slice(1)}`;

      // Open email client (in real app, this would be an API call)
      const mailtoLink = `mailto:${inviteEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink);
      
      toast.success('Email invitation opened in your default email client');
      setInviteEmail('');
      setInviteMessage('');
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      // Mock member addition - in real app, this would validate email and send invitation
      const newMember: ProjectMember = {
        id: `member-${Date.now()}`,
        name: inviteEmail.split('@')[0], // Extract name from email
        email: inviteEmail,
        role: inviteRole,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${inviteEmail}`,
        joinedAt: new Date().toISOString()
      };

      const updatedProject = {
        ...project,
        members: [...project.members, newMember],
        updatedAt: new Date().toISOString()
      };

      dispatch(updateProjectLocal(updatedProject));
      toast.success(`${inviteEmail} has been invited to the project`);
      setInviteEmail('');
    } catch (error) {
      toast.error('Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setLoading(true);
    try {
      const updatedProject = {
        ...project,
        members: project.members.filter(member => member.id !== memberId),
        updatedAt: new Date().toISOString()
      };

      dispatch(updateProjectLocal(updatedProject));
      toast.success('Member removed from project');
    } catch (error) {
      toast.error('Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: ProjectMember['role']) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'admin': return <Shield className="h-4 w-4 text-red-600" />;
      case 'member': return <Users className="h-4 w-4 text-blue-600" />;
      case 'viewer': return <Eye className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: ProjectMember['role']) => {
    switch (role) {
      case 'owner': return 'text-yellow-600 bg-yellow-100';
      case 'admin': return 'text-red-600 bg-red-100';
      case 'member': return 'text-blue-600 bg-blue-100';
      case 'viewer': return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Project
          </DialogTitle>
          <DialogDescription>
            Collaborate with others on "{project.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share Method Tabs */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                shareMethod === 'link' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setShareMethod('link')}
            >
              <Link2 className="h-4 w-4 inline mr-2" />
              Share Link
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                shareMethod === 'email' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setShareMethod('email')}
            >
              <Mail className="h-4 w-4 inline mr-2" />
              Email Invite
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                shareMethod === 'invite' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setShareMethod('invite')}
            >
              <UserPlus className="h-4 w-4 inline mr-2" />
              Add Member
            </button>
          </div>

          {/* Share Link Tab */}
          {shareMethod === 'link' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Link Permission</Label>
                <Select value={linkPermission} onValueChange={(value: 'viewer' | 'member') => setLinkPermission(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Viewer - Can view project and tasks
                      </div>
                    </SelectItem>
                    <SelectItem value="member">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Member - Can edit and comment
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Input 
                  value={generateShareLink(linkPermission)} 
                  readOnly 
                  className="flex-1"
                />
                <Button onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Anyone with this link will be able to {linkPermission === 'viewer' ? 'view' : 'collaborate on'} this project.
              </p>
            </div>
          )}

          {/* Email Invite Tab */}
          {shareMethod === 'email' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={inviteRole} onValueChange={(value: ProjectMember['role']) => setInviteRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - Can view only</SelectItem>
                    <SelectItem value="member">Member - Can edit and comment</SelectItem>
                    <SelectItem value="admin">Admin - Can manage project</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message to the invitation..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <Button onClick={handleSendEmail} disabled={loading || !inviteEmail} className="w-full">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Send Email Invitation
                  </div>
                )}
              </Button>
            </div>
          )}

          {/* Add Member Tab */}
          {shareMethod === 'invite' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                />
                <Select value={inviteRole} onValueChange={(value: ProjectMember['role']) => setInviteRole(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddMember} disabled={loading || !inviteEmail}>
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Current Members */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Project Members</h4>
              <Badge variant="outline">{project.members.length} members</Badge>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {project.members.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No members yet. Invite someone to collaborate!</p>
                </div>
              ) : (
                project.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{member.name}</span>
                          <Badge className={getRoleColor(member.role)} variant="secondary">
                            <div className="flex items-center gap-1">
                              {getRoleIcon(member.role)}
                              {member.role}
                            </div>
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    
                    {member.role !== 'owner' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}